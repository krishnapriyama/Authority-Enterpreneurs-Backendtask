import { accessToken, locationId } from "./config";
import express from "express";
import axios from "axios";

const access_Token = accessToken;
const location_Id = locationId;

const app = express();
const port = 4000;

const getRandomContact = async () => {
  try {
    const response = await axios.get(
      "https://services.leadconnectorhq.com/contacts/",
      {
        headers: {
          Authorization: `Bearer ${access_Token}`,
          Version: "2021-07-28",
        },
        params: {
          locationId: location_Id,
        },
      }
    );

    const contacts = response.data.contacts;
    if (contacts.length === 0) {
      throw new Error("No contacts found");
    }
    const random_contact =
      contacts[Math.floor(Math.random() * contacts.length)];
    console.log("Random Contact:-", random_contact.id);
    return random_contact.id;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Failed to fetch contacts");
  }
};

const updateCustomField = async (access_Token: string, contact_id: String) => {
  try {
    const resp = await axios.put(
      `https://services.leadconnectorhq.com/contacts/${contact_id}`,
      {
        customFields: [
          {
            id: "Pjslqhq89Az2ysMVxOHu",
            field_value: "Test",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${access_Token}`,
          Version: "2021-07-28",
        },
      }
    );
    console.log("Updated Custom Field with value TEST:-", resp.data);

    return resp.data;
  } catch (error) {
    console.error("Error updating contact custom field:", error);
    throw new Error("Failed to update contact custom field");
  }
};

app.get("/update-contact", async (req, res) => {
  try {
    if (!accessToken || !locationId) {
      throw new Error("Access Token Undefined");
    }
    const contact_id = await getRandomContact();
    const contact = await updateCustomField(accessToken, contact_id);

    res.json({ msg: "Contact updated successfully", contact });
  } catch (err) {
    const error = err as Error;
    console.error("Error occurred:", error.message);
    res.status(500).send("An error occurred: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
