import { db } from "@/drizzle/drizzle";
import { users, sessions} from "@/drizzle/schema/UserManagement/userManagement.schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users); 

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name : "token",
		expires: true,
		attributes: {
			secure: process.env.NODE_ENV === "development",
		}
	},
	getSessionAttributes : (users) => {
		return {
			role_id : users.role_id
		}
	},
	sessionExpiresIn : new TimeSpan(1, "d"),

});

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: {
			role_id : number,
		};
	}
	
}