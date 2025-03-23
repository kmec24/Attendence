export interface Session {
  session1: string;
  session2: string;
  session3: string;
  session4: string;
  session5: string;
  session6: string;
  session7: string;
}

export interface DayObject {
  day?: string;
  date: string;
  updatedon?: string;
  holiday: string;
  sessions: Session;
}

export interface Subject {
  subjectname: string;
  percentage: string | number;
  practical: string;
  colorcode1: string | null;
  colorcode2: string | null;
  mergedPercentage?: string | number;
}

export interface AttendanceData {
  name: string;
  attendance: {
    attandance: {
      dayobjects: DayObject[];
    };
    overallattperformance: {
      overall: Subject[];
      totalpercentage: string;
      colorcode: string;
    };
  };
  firebase: {
    roll_no: string;
    name: string;
    total: string;
    last_updated: string;
  };
}