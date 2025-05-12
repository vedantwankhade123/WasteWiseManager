import {
  users,
  User,
  InsertUser,
  adminSecretCodes,
  AdminSecretCode,
  InsertAdminSecretCode,
  reports,
  Report,
  InsertReport,
  UpdateReportStatus,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByCity(city: string): Promise<User[]>;
  getUserAdminsCountByCity(city: string): Promise<number>;

  // Admin secret code operations
  getAdminSecretCode(code: string): Promise<AdminSecretCode | undefined>;
  createAdminSecretCode(
    secretCode: InsertAdminSecretCode,
  ): Promise<AdminSecretCode>;
  markAdminSecretCodeAsUsed(id: number): Promise<boolean>;
  getAllAdminSecretCodes(): Promise<AdminSecretCode[]>;

  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getReportsByUserId(userId: number): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  getReportsByStatus(status: string): Promise<Report[]>;
  getReportsByCity(city: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(
    id: number,
    statusData: UpdateReportStatus,
  ): Promise<Report | undefined>;
  deleteReport(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adminSecretCodes: Map<number, AdminSecretCode>;
  private reports: Map<number, Report>;
  private userId: number;
  private adminSecretCodeId: number;
  private reportId: number;

  constructor() {
    this.users = new Map();
    this.adminSecretCodes = new Map();
    this.reports = new Map();
    this.userId = 1;
    this.adminSecretCodeId = 1;
    this.reportId = 1;

    // Add some initial admin secret codes
    this.createAdminSecretCode({ code: "ADMIN123", city: "New York" });
    this.createAdminSecretCode({ code: "ADMIN456", city: "Los Angeles" });
    this.createAdminSecretCode({ code: "ADMIN789", city: "Chicago" });
    this.createAdminSecretCode({ code: "ADMIN101", city: "Houston" });
    this.createAdminSecretCode({ code: "ADMIN202", city: "Phoenix" });
    // Add more codes for additional cities
    this.createAdminSecretCode({ code: "CLEAN_DELHI", city: "Delhi" });
    this.createAdminSecretCode({ code: "CLEAN_AMRAVATI", city: "Amravati" });
    this.createAdminSecretCode({ code: "CLEAN_MUMBAI", city: "Mumbai" });
    this.createAdminSecretCode({ code: "CLEAN_BANGALORE", city: "Bangalore" });
    this.createAdminSecretCode({ code: "CLEAN_LONDON", city: "London" });
    this.createAdminSecretCode({ code: "CLEAN_TOKYO", city: "Tokyo" });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      role: user.role || "user",
      secretCode: user.secretCode || null,
      isActive: true,
      rewardPoints: 0,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(
    id: number,
    userData: Partial<User>,
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByCity(city: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.city.toLowerCase() === city.toLowerCase(),
    );
  }

  async getUserAdminsCountByCity(city: string): Promise<number> {
    return Array.from(this.users.values()).filter(
      (user) =>
        user.city.toLowerCase() === city.toLowerCase() && user.role === "admin",
    ).length;
  }

  // Admin secret code operations
  async getAdminSecretCode(code: string): Promise<AdminSecretCode | undefined> {
    return Array.from(this.adminSecretCodes.values()).find(
      (secretCode) => secretCode.code === code,
    );
  }

  async createAdminSecretCode(
    secretCode: InsertAdminSecretCode,
  ): Promise<AdminSecretCode> {
    const id = this.adminSecretCodeId++;
    const newSecretCode: AdminSecretCode = { ...secretCode, id, isUsed: false };
    this.adminSecretCodes.set(id, newSecretCode);
    return newSecretCode;
  }

  async markAdminSecretCodeAsUsed(id: number): Promise<boolean> {
    const secretCode = this.adminSecretCodes.get(id);
    if (!secretCode) return false;

    secretCode.isUsed = true;
    this.adminSecretCodes.set(id, secretCode);
    return true;
  }

  async getAllAdminSecretCodes(): Promise<AdminSecretCode[]> {
    return Array.from(this.adminSecretCodes.values());
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId,
    );
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportsByStatus(status: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.status === status,
    );
  }

  async getReportsByCity(city: string): Promise<Report[]> {
    const usersInCity = await this.getUsersByCity(city);
    const userIds = usersInCity.map((user) => user.id);

    return Array.from(this.reports.values()).filter((report) =>
      userIds.includes(report.userId),
    );
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportId++;
    const now = new Date();
    const newReport: Report = {
      ...report,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      adminNotes: null,
      assignedAdminId: null,
      rewardPoints: null,
      completedAt: null,
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async updateReportStatus(
    id: number,
    statusData: UpdateReportStatus,
  ): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;

    const now = new Date();
    const updatedReport: Report = {
      ...report,
      ...statusData,
      updatedAt: now,
      completedAt: statusData.status === "completed" ? now : report.completedAt,
    };

    // If report is completed, assign reward points
    if (statusData.status === "completed" && report.status !== "completed") {
      updatedReport.rewardPoints = 50; // Default reward points

      // Update user's reward points
      const user = this.users.get(report.userId);
      if (user) {
        user.rewardPoints += updatedReport.rewardPoints;
        this.users.set(user.id, user);
      }
    }

    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async deleteReport(id: number): Promise<boolean> {
    return this.reports.delete(id);
  }
}

// Uncomment to use in-memory storage
// export const storage = new MemStorage();

// Import database storage
import {
  DatabaseStorage,
  initializeAdminSecretCodes,
} from "./database-storage";

// Use database storage instead of in-memory storage
export const storage = new DatabaseStorage();

// Initialize admin secret codes in the database
// This will be called when the server starts
initializeAdminSecretCodes().catch((err) => {
  console.error("Failed to initialize admin secret codes:", err);
});
