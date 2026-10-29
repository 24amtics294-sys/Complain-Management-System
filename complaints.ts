
import type { Complaint, ComplaintInput } from '../types';

const API_URL = 'http://localhost/complaint-api/complaints.php';

interface ApiComplaint {
  id: number | string;
  complaint_code?: string | null;
  title: string;
  description: string;
  category: Complaint['category'];
  priority: Complaint['priority'];
  status: Complaint['status'];
  role: Complaint['role'];
  complainantName: string;
  complainantEmail: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  attachments?: number;
}

interface ApiResponse {
  message?: string;
  id?: number | string;
  error?: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let result: T;

  try {
    result = JSON.parse(text) as T;
  } catch {
    throw new Error(
      'PHP API se valid response nahi mila. Apache aur PHP files check karein.'
    );
  }

  if (!response.ok) {
    const errorResult = result as ApiResponse;
    throw new Error(
      errorResult.error || `Request failed (${response.status})`
    );
  }

  return result;
}

export async function getComplaints(): Promise<Complaint[]> {
  const response = await fetch(API_URL);
  const rows = await readResponse<ApiComplaint[]>(response);

  if (!Array.isArray(rows)) {
    throw new Error('Database se complaints ki list sahi nahi aayi.');
  }

  return rows.map((row) => ({
    id: String(row.complaint_code || row.id),
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    role: row.role,
    complainantName: row.complainantName,
    complainantEmail: row.complainantEmail,
    location: row.location,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    attachments: row.attachments ?? 0,
  }));
}

export async function saveComplaint(
  input: ComplaintInput
): Promise<ApiResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const result = await readResponse<ApiResponse>(response);

  if (!result.id) {
    throw new Error('Complaint save hui ya nahi, iska confirmation nahi mila.');
  }

  return result;
}
