export interface Notification {
  id: number; // or whatever your ID type is
  message: string;
  recipients: string[]; // Include recipients in the model

  timestamp: Date; // or string, depending on your format
  read: boolean; // Add this line
}