"use server";
import { sql } from "@vercel/postgres";
import { professorRepository } from "@/repository/professor.repository";
import { IProfessorBase } from "@/repository/models/professor.model";
import { revalidatePath } from "next/cache";

interface InvitationPayload {
  email: string;
}
const CALENDLY_API_TOKEN = process.env.NEXT_PUBLIC_CALENDLY_ACCESS_TOKEN;
export async function getProfessorsForUser() {
  const { rows } =
    await sql`SELECT * FROM professors WHERE calendly_event_link IS NOT NULL`;
  return rows;
}
export async function getAllProfessors() {
  const { rows } = await sql`SELECT * FROM professors`;
  return rows;
}
export async function getProfessor(id: number) {
  const { rows } = await sql`SELECT * FROM professors WHERE id = ${id}`;
  return rows[0];
}
const sendInvitation = async (email: string, org_id: string) => {
  const payload: InvitationPayload = { email };
  const url = `https://api.calendly.com/organizations/${org_id}/invitations`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error: ${response.status} - ${response.statusText}`,
        errorData
      );

      // Check for specific error message about already invited
      if (response.status === 400 && errorData.title === "Already Invited") {
        return {
          resource: { status: "already invited", message: errorData.message },
        };
      }

      return {
        resource: {
          status: "error",
          message:
            errorData.message ||
            "An error occurred while sending the invitation.",
        },
      };
    }

    const data = await response.json();
    console.log("Invitation sent successfully:", data);
    return { resource: { status: "pending", data } }; // Assuming you want to return some data
  } catch (error) {
    console.error("Failed to send invitation:", error);
    return {
      resource: {
        status: "not sent",
        message: "Failed to send invitation due to a network error.",
      },
    };
  }
};

export async function createProfessor(professor: IProfessorBase) {
  try {
    const org_id_url = await getUserUri();
    const org_id = org_id_url.split("/").pop();

    const invitationStatus = await sendInvitation(professor.email, org_id);

    if (invitationStatus.resource.status === "pending") {
      const insertedProfessorId = await professorRepository.create(professor);
      return { insertedProfessorId, invitationSent: "success" };
    } else if (invitationStatus.resource.status === "already invited") {
      return {
        invitationSent: "already sent",
        message: invitationStatus.resource.message, // This will contain the specific error message
      };
    } else {
      return {
        invitationSent: invitationStatus.resource.status,
        message:
          invitationStatus.resource.message ||
          "Unknown error while sending invitation.",
      };
    }
  } catch (error) {
    console.error("Error creating professor:", error);
    return {
      invitationSent: "failure",
      message: "Failed to create professor. Please try again.",
    };
  }
}

export async function updateProfessor(id: number, professor) {
  const { rows } = await sql`
    UPDATE professors
    SET name = ${professor.name}, 
        department = ${professor.department}, 
        short_bio = ${professor.short_bio}, 
        calendly_event_link = ${professor.calendly_event_link}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function getProfessorLink(id: number) {
  await sql`Select calendly_event_link FROM professors WHERE id = ${id}`;
}
export async function getUserUri() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.resource.current_organization;
  } catch (error) {
    console.error("Error fetching organization URI", error);
    throw error;
  }
}
export async function getOrganizationUri() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.current_organization);
    return data.resource.current_organization;
  } catch (error) {
    console.error("Error fetching organization URI", error);
    throw error;
  }
}
export async function getUsersAppointments(email: string) {
  try {
    const userUri = await getOrganizationUri();
    const url = `https://api.calendly.com/scheduled_events?organization=${userUri}&invitee_email=${email}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    // Get event updates including invitee details
    const eventUpdateUrl = await Promise.all(
      data.collection.map(async (item) => {
        const parts = item.uri.split("/");
        const eventUuid = parts[parts.length - 1];
        const inviteeDetails = await getInviteeDetails(eventUuid);

        return {
          eventUuid,
          inviteeDetails,
        };
      })
    );

    // Map the cancel_url and reschedule_url back to data.collection
    const updatedCollection = data.collection.map((event) => {
      const eventParts = event.uri.split("/");
      const eventUuid = eventParts[eventParts.length - 1];

      // Find the corresponding inviteeDetails from eventUpdateUrl
      const eventUpdate = eventUpdateUrl.find(
        (update) => update.eventUuid === eventUuid
      );

      if (eventUpdate && eventUpdate.inviteeDetails) {
        const invitee = eventUpdate.inviteeDetails.collection[0]; // Assuming there's only one invitee per event

        return {
          ...event,
          cancel_url: invitee.cancel_url,
          reschedule_url: invitee.reschedule_url,
        };
      }

      return event; // If no matching event update is found
    });

    return updatedCollection;
  } catch (error) {
    console.error("Error fetching user URI", error);
    throw error;
  }
}

export async function getScheduledEvents() {
  const userUri = await getUserUri();

  try {
    const response = await fetch(
      `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(
        userUri
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error fetching scheduled events:", errorText);
      throw new Error(`Error fetching Calendly events: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(
      "-------------",
      "Scheduled events:",
      data.collection,
      "------------------"
    );
    return data.collection;
  } catch (error) {
    console.error("Error fetching scheduled events", error);
    throw error;
  }
}
export async function getInviteeDetails(event_uuid: string) {
  const response = await fetch(
    `https://api.calendly.com/scheduled_events/${event_uuid}/invitees`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Error fetching scheduled events:", errorText);
    throw new Error(`Error fetching Calendly events: ${response.statusText}`);
  }
  const data = await response.json();
  console.log("Scheduled event invitees:", data);
  return data;
}
// -----------------------------------------------------------------------------
export async function checkInvitationAndUpdateCalendlyLink(email: string) {
  try {
    // Step 1: Get the organization URI
    const org_id_url = await getUserUri();
    // Extracting the UUID from the URI

    // Step 2: Fetch invitations filtered by email
    const status_url = `${org_id_url}/invitations?email=${email}`;
    console.log(status_url);
    const invitationsResponse = await fetch(`${status_url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!invitationsResponse.ok) {
      throw new Error(
        `Error fetching invitations: ${invitationsResponse.statusText}`
      );
    }

    const invitationsData = await invitationsResponse.json();
    const invitation = invitationsData.collection[0]; // Assuming we're interested in the first invitation
    console.log(invitation);
    // Step 3: Check if the invitation status is accepted
    if (invitation && invitation.status === "accepted") {
      // Step 4: Fetch user details using the user URI from the invitation
      const userResponse = await fetch(invitation.user, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Error fetching user: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      const calendlyLink = userData.resource.scheduling_url; // Extracting the Calendly link

      // Step 5: Fetch the professor from your database by email
      const professor = await professorRepository.getByEmail(email);

      if (professor) {
        // Step 6: Update the professor with the Calendly link
        const resp = await professorRepository.update(professor.id, {
          ...professor,
          calendlyEventLink: calendlyLink,
        });
        console.log("saaiiiiii", professor);
        return {
          success: true,
          message: "Calendly link updated successfully.",
        };
      } else {
        throw new Error("Professor not found in the database.");
      }
    } else {
      return {
        success: false,
        message: "Invitation not accepted or not found.",
      };
    }
  } catch (error) {
    console.error("Error in checkInvitationAndUpdateCalendlyLink:", error);
    throw error;
  } finally {
    revalidatePath("/admin/professors");
  }
}
