import { sql } from "@vercel/postgres";
import axios from "axios";

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

export async function createProfessor(professor) {
  const { rows } = await sql`
    INSERT INTO professors (name, department, short_bio, calendly_event_link)
    VALUES (${professor.name}, ${professor.department}, ${professor.short_bio}, ${professor.calendly_event_link})
    RETURNING *
  `;
  return rows[0];
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

export async function deleteProfessor(id: number) {
  await sql`DELETE FROM professors WHERE id = ${id}`;
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
