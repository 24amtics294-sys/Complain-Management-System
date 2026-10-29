export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplainantRole = 'Student' | 'Professor';
export type ComplaintCategory =
  | 'Classroom & Facilities'
  | 'Cleanliness & Sanitation'
  | 'Electricity'
  | 'Water Supply'
  | 'Campus Safety'
  | 'Parking & Transport'
  | 'Examination'
  | 'Faculty & Teaching'
  | 'Library'
  | 'Hostel & Mess'
  | 'Other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  role: ComplainantRole;
  complainantName: string;
  complainantEmail: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  attachments?: number;
}

export interface ComplaintInput {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  role: ComplainantRole;
  complainantName: string;
  complainantEmail: string;
  location: string;
}

export interface ActivityLog {
  id: string;
  complaintId: string;
  action: string;
  detail: string;
  timestamp: string;
}
