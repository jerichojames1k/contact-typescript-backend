import { getConnection, releaseConnection } from "@src/db/db";
//import { Post } from "@src/models/mode";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export abstract class AuthService {
  public static async handleLogin(req: any, res: any) {
    const { email, pwd } = req.body;
    const connection = await getConnection();
    try {
      if (!email || !pwd) {
        return res
          .status(400)
          .json({ message: "Username and password are required." });
      }
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute(
        `SELECT * FROM userdata where emailAddress ='${email}'`
      );
      let Posts = rows.map((r: any) => {
        return <any>r;
      });

      const foundUser = Posts?.[0];
      if (!foundUser) return res.sendStatus(401); //Unauthorized
      const match = await bcrypt.compare(pwd, foundUser.password);
      if (match) {
        // create JWTs
        const accessToken = jwt.sign(
          { userEmail: foundUser.emailAddress },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
          { userEmail: foundUser.emailAddress },
          process.env.REFRESH_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );

        let [rows, fields] = await connection.execute(
          "UPDATE userdata SET refreshToken = ? WHERE id = ?",
          [refreshToken, foundUser?.id]
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
          id: foundUser?.id,
          accessToken,
          roles: foundUser.roles,
          pwd: foundUser.password,
          user: foundUser.username,
          userId: foundUser?.id,
        });
        return rows;
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }
  public static async handleRefreshToken(req: any, res: any) {
    const cookies = req.cookies;
    console.log(
      "%c ♓: handleRefreshToken -> cookiesRefreshToken",
      "font-size:16px;background-color:#ce99f6;color:white;",
      cookies.jwt
    );
    const connection = await getConnection();
    try {
      if (!cookies?.jwt) return res.sendStatus(401);
      const refreshToken = cookies.jwt;
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute(
        `SELECT * FROM userdata where refreshToken ='${refreshToken}'`
      );
      let postRefreshToken = rows.map((r: any) => {
        return <any>r;
      });

      const foundUser = postRefreshToken?.[0];
      if (!foundUser) return res.sendStatus(401); //Unauthorized
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        (err: any, decoded: any) => {
          console.log(
            "%c 🌪️: handleRefreshToken -> decoded ",
            "font-size:16px;background-color:#d598d3;color:white;",
            decoded
          );
          if (err || foundUser.emailAddress !== decoded.userEmail)
            return res.sendStatus(403);
          const accessToken = jwt.sign(
            { userEmail: decoded.email },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "30s" }
          );
          res.json({
            id: foundUser?.id,
            accessToken,
            roles: foundUser.roles,
            pwd: foundUser.password,
            user: foundUser.username,
            userId: foundUser?.id,
          });
        }
      );
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }

  public static async handleLogout(req: any, res: any) {
    const cookies = req.cookies;
    console.log(
      "%c ♓: handleRefreshToken -> cookiesRefreshToken",
      "font-size:16px;background-color:#ce99f6;color:white;",
      cookies.jwt
    );
    const connection = await getConnection();
    try {
      if (!cookies?.jwt) return res.sendStatus(401);
      const refreshToken = cookies.jwt;
      // Perform your database query using the connection
      let [rows, fields] = await connection.execute(
        `SELECT * FROM userdata where refreshToken ='${refreshToken}'`
      );
      let postRefreshToken = rows.map((r: any) => {
        return <any>r;
      });

      const foundUser = postRefreshToken?.[0];
      if (!foundUser) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        return res.sendStatus(204);
      }
      const data = await connection.execute(
        `UPDATE userdata SET refreshToken = ? WHERE id = ?`,
        ["", foundUser?.id]
      );

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.sendStatus(204);
      return data;
    } catch (error) {
      console.error(`Error executing query: ${error.message}`);
      return error.message;
    } finally {
      // Release the connection back to the pool when done
      releaseConnection(connection);
    }
  }
}
