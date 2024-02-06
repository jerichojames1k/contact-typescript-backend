import { getConnection, releaseConnection } from "@src/db/db";
import { Post } from "@src/models/mode";
export abstract class ContactService {
  public static async getAllPosts(_params?: string): Promise<Post[]> {
    const connection = await getConnection();
    try {
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute("SELECT * FROM userdata");
      let Posts = rows.map((r: any) => {
        return <Post>r;
      });
      return Posts;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }
  public static async  handleGetAllContactsAddByUser(req: any, res: any) {
    const { userId } = req.body;
    const connection = await getConnection();
    try {
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute(
        `SELECT * FROM contacts WHERE userId = '${userId}'`
      );
      let postContacts = rows.map((r: any) => {
        return <any>r;
      });
      res.status(201).json(postContacts);
      return;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }

  public static async handleContactAdd(req: any, res: any): Promise<any> {
    const { name, company, phone, email,userId } = req.body;
    const connection = await getConnection();
    try {
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute(`SELECT * FROM contacts where email ='${email}'`);
      let results = rows.map((r: any) => {
        return <any>r;
      });
      const duplicate = results?.[0];
      if (duplicate) {
        return res.sendStatus(409); //Conflict
      }

      let sql = `INSERT INTO contacts(userId,name,company,phone,email) VALUES ('${userId}','${name}','${company}','${phone}','${email}')`;
      let resultData= await connection.execute(sql);
      res.status(201).json({ success: `New contact created!`});
      return resultData;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }
  public static async handleContactEdit(req: any, res: any): Promise<any> {
    const { name, company, phone, email,id } = req.body;
    const connection = await getConnection();
    try {
      // Perform your database query using the connection
    //   let [rows, fields] = await connection.execute(`SELECT * FROM contacts where email ='${email}'`);
    //   let results = rows.map((r: any) => {
    //     return <any>r;
    //   });
    //   const duplicate = results?.[0];
    //   if (duplicate) {
    //     return res.sendStatus(409); //Conflict
    //   }
      let sql = `UPDATE contacts SET name = ?,company = ?,phone = ?,email = ? WHERE id = ?`;
      let resultData= await connection.execute(sql, [name, company, phone, email, id],);
      res.status(201).json({ success: `Contact successfully updated!` });
      return resultData;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }

  public static async handleContactDelete(req: any, res: any): Promise<any> {
    const {id} = req.body;
    const connection = await getConnection();
    try {
      let sql = `DELETE FROM contacts WHERE id= ?`;
      let resultData= await connection.execute(sql, [id],);
      console.log("%c ⌨️: ContactService -> resultData ", "font-size:16px;background-color:#edb021;color:white;", resultData)
      res.status(201).json({ success: `Contact successfully deleted!` });
      return resultData;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }

  public static async handleContactSearch(req: any, res: any): Promise<any> {
    const {searchTerm,userId} = req.body;
    const connection = await getConnection();
    try {
      let sql =      `
      SELECT *
      FROM contacts
      WHERE
        (name LIKE '%${searchTerm}%' OR
        company LIKE '%${searchTerm}%' OR
        phone LIKE '%${searchTerm}%' OR
        email LIKE '%${searchTerm}%') AND userId= '${userId}';
    `;
      let [rows]= await connection.execute(sql);
      let resultData = rows.map((r: any) => {
        return <Post>r;
      });
      res.status(201).json(resultData);
      console.log("%c 🌱: ContactService -> resultData ", "font-size:16px;background-color:#88f683;color:black;", resultData)
      return resultData;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }
}
