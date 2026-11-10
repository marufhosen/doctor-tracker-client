const encodePathSegment = (value: string): string => encodeURIComponent(value);

export const apiEndpoints = {
  auth: {
    login: "auth/login",
    refresh: "auth/refresh",
    me: "auth/me",
    logout: "auth/logout",
  },
  doctors: {
    list: "doctors",
    create: "doctors",
    detail: (doctorId: string) => `doctors/${encodePathSegment(doctorId)}`,
    patients: (doctorId: string) => `doctors/${encodePathSegment(doctorId)}/patients`,
    patient: (doctorId: string, patientId: string) =>
      `doctors/${encodePathSegment(doctorId)}/patients/${encodePathSegment(patientId)}`,
  },
  patients: {
    list: "patients",
    detail: (patientId: string) => `patients/${encodePathSegment(patientId)}`,
  },
  dashboard: {
    summary: "dashboard/summary",
    patientsByDoctor: "dashboard/patients-by-doctor",
    trends: "dashboard/trends",
  },
} as const;
