// ITransaction model definition
export interface ITransaction {
  transactionId: number;
  userId: number;
  bookId: number;
  issuedDate: Date;
  status: string;
}
