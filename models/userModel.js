import pool from "../config/database.js";

export async function getAllUsers(){
  try{
    const [result] = await pool.query("SELECT * FROM user");
    return result.map((row) => ({
      email: row.email,
      password: row.password
    }));

  }catch (error){
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserByEmail(email){
  try{
    const [result] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    return result[0];
  }catch (error){
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

export async function createUser(userData){
  try{
    const { first_name, last_name, email, telephone, password, role } = userData;
    const [result] = await pool.query(
      "INSERT INTO user (first_name, last_name, email, telephone, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, telephone, password, role]
    );
    return result.insertId;
  }catch (error){
    console.error("Error adding user:", error);
    throw error;
  }
}
