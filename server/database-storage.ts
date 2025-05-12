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
  UpdateReportStatus
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Database storage implementation
export class DatabaseStorage implements IStorage {
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Make sure role and secretCode are properly set
    const userData = {
      ...user,
      role: user.role || "user",
      secretCode: user.secretCode || null
    };

    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    
    return result.length > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async getUsersByCity(city: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.city, city));
  }
  
  async getUserAdminsCountByCity(city: string): Promise<number> {
    const result = await db
      .select()
      .from(users)
      .where(and(
        eq(users.city, city),
        eq(users.role, "admin")
      ));
    
    return result.length;
  }

  // Admin secret code operations
  async getAdminSecretCode(code: string): Promise<AdminSecretCode | undefined> {
    const [secretCode] = await db
      .select()
      .from(adminSecretCodes)
      .where(eq(adminSecretCodes.code, code));
    
    return secretCode || undefined;
  }

  async createAdminSecretCode(secretCode: InsertAdminSecretCode): Promise<AdminSecretCode> {
    const [newSecretCode] = await db
      .insert(adminSecretCodes)
      .values({ ...secretCode, isUsed: false })
      .returning();
    
    return newSecretCode;
  }

  async markAdminSecretCodeAsUsed(id: number): Promise<boolean> {
    const result = await db
      .update(adminSecretCodes)
      .set({ isUsed: true })
      .where(eq(adminSecretCodes.id, id))
      .returning({ id: adminSecretCodes.id });
    
    return result.length > 0;
  }

  async getAllAdminSecretCodes(): Promise<AdminSecretCode[]> {
    return await db.select().from(adminSecretCodes);
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id));
    
    return report || undefined;
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.userId, userId));
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async getReportsByStatus(status: string): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .where(eq(reports.status, status));
  }
  
  async getReportsByCity(city: string): Promise<Report[]> {
    // For this we need to join with users to filter by city
    // First get all users from that city
    const usersInCity = await this.getUsersByCity(city);
    const userIds = usersInCity.map(user => user.id);
    
    if (userIds.length === 0) {
      return [];
    }
    
    // Then get all reports from those users
    // This isn't ideal but works for now - with more complex SQL we could do this in one query
    const allReports = await this.getAllReports();
    return allReports.filter(report => userIds.includes(report.userId));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const now = new Date();
    
    const [newReport] = await db
      .insert(reports)
      .values({
        ...report,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        adminNotes: null,
        assignedAdminId: null,
        rewardPoints: null,
        completedAt: null
      })
      .returning();
    
    return newReport;
  }

  async updateReportStatus(id: number, statusData: UpdateReportStatus): Promise<Report | undefined> {
    // First get the current report
    const report = await this.getReport(id);
    if (!report) return undefined;
    
    const now = new Date();
    const updateData: any = {
      ...statusData,
      updatedAt: now
    };
    
    // If status is changing to completed, set completedAt and rewardPoints
    if (statusData.status === "completed" && report.status !== "completed") {
      updateData.completedAt = now;
      updateData.rewardPoints = 50; // Default reward points
      
      // Update user's reward points
      if (report.userId) {
        const user = await this.getUser(report.userId);
        if (user) {
          await this.updateUser(user.id, {
            rewardPoints: (user.rewardPoints || 0) + 50
          });
        }
      }
    }
    
    const [updatedReport] = await db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, id))
      .returning();
    
    return updatedReport || undefined;
  }

  async deleteReport(id: number): Promise<boolean> {
    const result = await db
      .delete(reports)
      .where(eq(reports.id, id))
      .returning({ id: reports.id });
    
    return result.length > 0;
  }
}

// Initialize admin secret codes in the database
export async function initializeAdminSecretCodes() {
  const existingCodes = await db.select().from(adminSecretCodes);
  
  // Only add default codes if none exist
  if (existingCodes.length === 0) {
    console.log("Initializing admin secret codes in database...");
    
    // Add default admin secret codes
    const defaultCodes = [
      { code: "ADMIN123", city: "New York" },
      { code: "ADMIN456", city: "Los Angeles" },
      { code: "ADMIN789", city: "Chicago" },
      { code: "ADMIN101", city: "Houston" },
      { code: "ADMIN202", city: "Phoenix" },
      { code: "CLEAN_DELHI", city: "Delhi" },
      { code: "CLEAN_MUMBAI", city: "Mumbai" },
      { code: "CLEAN_BANGALORE", city: "Bangalore" },
      { code: "CLEAN_LONDON", city: "London" },
      { code: "CLEAN_TOKYO", city: "Tokyo" }
    ];
    
    for (const codeData of defaultCodes) {
      await db
        .insert(adminSecretCodes)
        .values({ ...codeData, isUsed: false });
    }
    
    console.log("Admin secret codes initialized successfully");
  }
}