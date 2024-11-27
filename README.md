# COMS4156-Project
Repository for COMS 4156 24F, Team Scrum Masters 

EventEase is a flexible RESTful service designed to simplify and automate the complexities of event management. EventEase offers a seamless solution to manage everything from event creation to event registration. With endpoints for task management, RSVP handling, and real-time reporting, EventEase empowers various applications with robust event management capabilities, allowing organizers and hosters to focus on delivering great user experiences. EventEase API makes it easy to integrate sophisticated event planning tools into any system, no matter the size or scope of your event.

To distinguish from regular event-management services and make it useful for elderly users, Eventease provides SMS and email reminders for events, allowing elderly users to stay informed without relying on complex apps. Additionally, a simple RSVP system could be integrated, enabling one-click RSVP via email or SMS, reducing the need for navigating complicated interfaces. The API would also support caregiver collaboration, allowing caregivers to manage event details, send RSVPs, or receive notifications on behalf of elderly users. Lastly, an option for simplified, large-text invitations or event details could be offered to ensure better accessibility for users with vision impairments or low digital literacy.

## Backend Repository  
Link to the backend repository is [Click Here](https://github.com/COMS4156-Eventease/COMS4156-Project)

## Technologies Used
- **Spring Boot**: 
- **Spring MVC**: For structuring the application with the MVC pattern.
- **MySQL**: As the relational database for data storage.
- **Postman**: To test various endpoints provided by our service.
- **Google Cloud Platform**: For hosting the database and service in the cloud environment.

## Installation 

### Prerequisite
- **Java 17**
- **Maven**
- **Spring Boot 3.3.4**
- **Ubuntu 24**
  
### Installing the Repository
Open the terminal in the folder in which you wish to clone the repository and enter the following command:
```
git clone https://github.com/COMS4156-Eventease/COMS4156-Project.git
cd COMS4156-Project
```
### Building and running a local instance

The instructions below are for Ubuntu 24.04, however they should be the same for all platforms supported by Java and MySQL.
To build and run the service, install the following:

- **Maven 3.9.5**: [Download Maven](https://maven.apache.org/download.cgi) and follow the installation steps. Ensure the `bin` directory is added to your system's path.
- **JDK 17**: [Download JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html), as it is the recommended version for this project.
- **MySQL 8.0**: [Download MySQL](https://dev.mysql.com/downloads/mysql/) and follow the installation steps. Ensure the `bin` directory is added to your system's path.
- **IntelliJ IDE**: [Download IntelliJ](https://www.jetbrains.com/idea/download/?section=windows) or use any IDE you prefer.


### Changes to be done before starting the Springboot application

#### Set up .env file
This project requires a `.env` file to store sensitive configuration details such as API credentials, database connection strings, and cloud service credentials. Follow the steps below to set up the `.env` file:

### 1. Create the `.env` File

1. In the root directory of the project, create a file named `.env`.
2. Add the following environment variables to the `.env` file:

   ```plaintext
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # Database Configuration
   DB_URL=jdbc:mysql://<your-database-host>:<your-database-port>/<your-database-name>
   DB_USERNAME=your_database_username
   DB_PASSWORD=your_database_password

   # GCP Credentials
   GCP_CREDENTIALS={"type": "service_account","project_id": "<your-project-id>","private_key_id": "<your-private-key-id>","private_key": "-----BEGIN PRIVATE KEY-----\n<your-private-key>\n-----END PRIVATE KEY-----\n","client_email": "<your-client-email>","client_id": "<your-client-id>","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "https://oauth2.googleapis.com/token","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/<your-client-email>"}

### Running the application

To run the application, use:
```bash
mvn spring-boot:run 
```

To make sure the application works, try navigating to http://localhost:8080/test.

## Cloud Application Deployment

The application is currently deployed on Google Cloud Platform (GCP) using App Engine at https://eventease-439518.ue.r.appspot.com/.

### Prerequisites
1. **Google Cloud SDK**: Install and set up [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. **GCP Project**: Create a GCP project set up the connection to the GCP project in the project folder 

### Step 1: Create an `app.yaml` File
In the root folder of the project, create an `app.yaml` file, which configures GCP App Engine environment.

Below is a sample  `app.yaml` template:
```yaml
runtime: java17
instance_class: F2  # Choose an instance class based on your requirements
automatic_scaling:
  min_instances: 1
  max_instances: 2
env_variables:
  SPRING_DATASOURCE_URL: <YOUR_DATABASE_URL>
  SPRING_DATASOURCE_USERNAME: <YOUR_DATABASE_USERNAME>
  SPRING_DATASOURCE_PASSWORD: <YOUR_DATABASE_PASSWORD>
  TWILIO_ACCOUNT_SID: <your_twilio_account_sid>
  TWILIO_AUTH_TOKEN: <your_twilio_auth_token>
  TWILIO_PHONE_NUMBER: <your_twilio_phone_number>
  GCP_CREDENTIALS: | 
    {
      "type": "service_account",
      "project_id": "<your-project-id>",
      "private_key_id": "<your-private-key-id>",
      "private_key": "-----BEGIN PRIVATE KEY-----\n<your-private-key>\n-----END PRIVATE KEY-----\n",
      "client_email": "<your-client-email>",
      "client_id": "<your-client-id>",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/<your-client-email>"
    }

```
### Step 2: Build the project using Maven
```bash
mvn clean package
```

### Step 3: Deploy to the GCP App Engine
```bash
gcloud app deploy
```

## Creating a test coverage report and code style check
Generate test coverage report:
```bash
mvn jacoco:report
```

Currently, the branch coverage sits at 61%:
![image](https://github.com/user-attachments/assets/02905c92-01c0-43b1-8c5b-a6424ca00a8b)


Run code style checks:
```
mvn checkstyle:check
```

Currently there are no style reports:
![image](https://github.com/user-attachments/assets/1a22e18a-5186-41fa-bd20-a812f0b7296c)



## Automated CI/CD Pipeline

This project has an automatic CI/CD pipeline set up using GitHub Actions. The pipeline is triggered on every commit and pull request across the repository.

The pipeline does the following:
- Compile the Java application
- Run unit tests using `mvn test`
- Runs and publishes a JaCoCo test coverage report as an artifact
- Checks code style using Checkstyle


## Development lifecycle

For every new feature, a new branch should be created. Once that branch is ready to be merged, at least one other maintainer will need to approve it before it is able to be merged. 


## Endpoint Documentation 

After starting the server, an autogenerated JSON OpenAPI spec can be found at http://localhost:8080/v3/api-docs, and interactive Swagger documentation at http://localhost:8080/swagger-ui.html.

We also have a Postman project, with documentation and interactive use of the application endpoints, available [here](https://app.getpostman.com/join-team?invite_code=eea8c84c7c09777bda22eee83481fbb4&target_code=2abee4fb469468093755029c4cabf645). 

Here is documentation for all the HTTP endpoints exposed by this application:

### Created Endpoints
#### Event Management
##### POST /api/events
* Expected Input Parameters:
  * Request Parameters:
    * organizerId (Long): The ID of the organizer (user creating the event) passed as a query parameter.
  * Request Body:
    * event (Object):
      * name (String): Name of the event.
      * description (String): Description of the event.
      * location (String): Location where the event is held.
      * date (String): The date of the event (in YYYY-MM-DD format).
      * time (String): The time of the event (in HH:MM format).
      * capacity (int): Maximum number of participants allowed.
      * budget (int): Budget for the event.
* Expected Output: A JSON object containing the organizerId and the eventId of the newly created 
      event.
* Operation: Creates a new event with the specified details and sets the organizer for the event.
* Upon Success:
  * HTTP 201 Status Code with:
  *  `{
    "organizerId": "The organizer's user ID",
    "eventId": "The newly created event's ID"
    }`
* Upon Failure:
  * HTTP 404 Status Code with "Organizer not found" if the provided organizerId is invalid.
  * HTTP 500 Status Code with an error message in the response body in case of any other server 
    error.
  
##### GET /api/events/{eventId}
* Expected Input Parameters:
  * Path Parameter:
    * eventId (Long): The ID of the event to retrieve.
* Expected Output: A JSON object representing the event details.

* Operation: Retrieves the details of a specific event by its ID.

* Upon Success:
  * HTTP 200 Status Code with the full details of the event in the response body.
* Upon Failure:
  * HTTP 404 Status Code with "Event not found" if the event with the provided eventId does not 
  exist.
  * HTTP 500 Status Code with "An unexpected error has occurred" in the response body.

##### GET /api/events
* Expected Input Parameters:

  * Query Parameters:
    * startDate (String): The start date of the range in YYYY-MM-DD format.
    * endDate (String): The end date of the range in YYYY-MM-DD format.
* Expected Output: A list of event objects that fall within the specified date range.
* Operation: Retrieves a list of events between the specified start and end dates.
* Upon Success:
  * HTTP 200 Status Code with the list of events in the response body.
* Upon Failure:
  * HTTP 400 Status Code if the date parameters are not provided or invalid.
  * HTTP 500 Status Code with "An unexpected error has occurred" in the response body.

##### PATCH /api/events/{eventId}
* Expected Input Parameters:
  * Path Parameter:
    * eventId (Long): The ID of the event to update.
  * Request Body:
    * event (Object):
      * name (String): Name of the event.
      * description (String): Description of the event.
      * location (String): Location where the event is held.
      * date (String): The date of the event (in YYYY-MM-DD format).
      * time (String): The time of the event (in HH:MM format).
      * capacity (int): Maximum number of participants allowed.
      * budget (int): Budget for the event.
* Expected Output: A string indicating the result of the operation.
* Operation: Updates the specified event's details. Only the provided fields will be updated.
* Upon Success:
  * HTTP 200 Status Code with "Event updated successfully" in the response body.
* Upon Failure:
  * HTTP 404 Status Code with "Event not found" if the event with the provided eventId does not exist.
  * HTTP 400 Status Code with "Failed to update event" in case of invalid input or other errors.


#### RSVP Management 

##### POST /api/events/{eventId}/rsvp/{userId}
* POST RSVP for an event
* Expected Path Variables: eventId (String), userId(String)
* Expected Output: RSVP Object
* Upon Success: HTTP 201 Status Code is returned 
* Upon Failure: 
  * HTTP 400 Status Code is returned with the message indicating RSVP already exists
  * HTTP 404 Status Code is returned along with the message indicating user or event not found.
  * HTTP 500 Internal Server Error for other issues

##### GET /api/events/{eventId}/attendees
* Retrieves the list of attendees for a given event, identified by eventId.
* Expected Path Variables: eventId (String)
* Expected Output: List of RSVP Object
* Upon Success: 200 OK with the list of attendees 
* Upon Failure:
  * HTTP 404 Status Code is returned if the event is not found.
  * HTTP 500 Internal Server Error for other issues

##### DELETE /api/events/{eventId}/rsvp/cancel/{userId}
* Cancels an RSVP for a user to a specified event.
* Expected Path Variables: eventId (String), userId(String)
* Expected Output: Success Message (String)
* Upon Success: 200 OK with a successful cancellation message.
* Upon Failure:
  * HTTP 404 Status Code is returned if the event/user/rsvp is not found.
  * HTTP 500 Internal Server Error for other issues

##### PATCH /api/events/{eventId}/rsvp/{userId}
* Partially updates an RSVP for a user to a specified event.
* Expected Path Variables:
  * eventId (String)
  * userId (String)
* Expected Request Body: JSON object with fields to update in the RSVP.
* Expected Output: Success Message (String) with updated RSVP details.
* Upon Success:
  * 200 OK with the updated RSVP details.
* Upon Failure:
  * HTTP 404 Status Code is returned if the event, user, or RSVP is not found.
  * HTTP 500 Internal Server Error for other issues.

##### POST /api/events/{eventId}/rsvp/checkin/{userId}
* Checks in a user to a specified event.
* Expected Path Variables:
  * eventId (String)
  * userId (String)
* Expected Output: Success Message (String).
* Upon Success:
  * 200 OK with a message indicating successful check-in.
* Upon Failure:
  * HTTP 404 Status Code is returned if the event, user, or RSVP is not found.
  * HTTP 500 Internal Server Error for other issues.

##### GET /api/events/rsvp/user/{userId}
* Retrieves all RSVPs for a specific user.
* Expected Path Variables:
  * userId (String)
* Expected Output: List of RSVP objects (JSON).
* Upon Success:
  * 200 OK with a list of RSVPs for the specified user.
* Upon Failure:
  * HTTP 404 Status Code is returned if the user is not found.
  * HTTP 500 Internal Server Error for other issues.

##### GET /api/events/rsvp/user/{userId}/checkedin
* Retrieves all checked-in RSVPs for a specific user.
* Expected Path Variables:
  * userId (String)
* Expected Output: List of checked-in RSVP objects (JSON).
* Upon Success:
  * 200 OK with a list of checked-in RSVPs for the specified user.
* Upon Failure:
  * HTTP 404 Status Code is returned if the user is not found.
  * HTTP 500 Internal Server Error for other issues.

#### Task Management
##### POST /api/events/{eventId}/tasks
* Creates a new task for the specified event and assigns it to a user.
* Expected Input Parameters:
  * Path Parameters:
    * eventId (String): The ID of the event for which the task is being created.
  * Query Parameters:
    * userId (String): The ID of the user creating the task.
    * Request Body (JSON):
    * name (String): Name of the task.
    * description (String): Description of the task.
    * status (String): Status of the task. Valid values: PENDING, COMPLETED, IN_PROGRESS, CANCELLED.
    * dueDate (String): Due date of the task in YYYY-MM-DD HH:MM:SS format.
* Upon Success:
  * HTTP 201 Status Code with:
  *  `{
     "taskId": "The newly created task's ID",
     "eventId": "The event's ID",
     "userId": "The user's ID"
     }`
* Upon Failure:
  * HTTP 404 Status Code is returned along with the message indicating user or event not found.
  * HTTP 500 Internal Server Error for other issues.
    
##### GET /api/events/{eventId}/tasks
* Retrieves all tasks associated with a specific event.
* Expected Input Parameters:
  * Path Parameters:
    * eventId (String): The ID of the event to retrieve tasks from.
* Upon Success:
  * HTTP 200 Status Code with list of tasks associated with event.
* Upon Failure:
  * HTTP 404 Status Code is returned along with the message indicating event not found.
  * HTTP 500 Internal Server Error for other issues.

##### GET /api/events/{eventId}/tasks/{taskId}
* Retrieves a specific task by its ID and associated event.
* Expected Input Parameters:
  * Path Parameters:
    * taskId (String): The ID of the event and specific task to retrieve.
* Upon Success:
  * HTTP 200 Status Code with task and its respective details.
* Upon Failure:
  * HTTP 404 Status Code is returned along with the message indicating event or task not found.
  * HTTP 500 Internal Server Error for other issues.

##### PATCH /api/events/{eventId}/tasks/{taskId}/status
* Updates the status of a specific task within an event.
* Expected Input Parameters:
  * Path Parameters:
    * eventId (String): The ID of the event containing the task that is being updated.
    * taskId (String): The ID of the specific task being updated.
  * Query Parameters:
    * status (String): Status of the task. Valid values: PENDING, COMPLETED, IN_PROGRESS, CANCELLED.
* Upon Success:
  * HTTP 200 Status Code with task and its respective details.
* Upon Failure:
  * HTTP 400 Status Code is returned if the request body does not contain a valid status enumeration.
  * HTTP 404 Status Code is returned along with the message indicating event or task not found.
  * HTTP 500 Internal Server Error for other issues.

##### PATCH /api/events/{eventId}/tasks/{taskId}/user
* Updates the assigned user for a specific task within an event.
* Expected Input Parameters:
  * Path Parameters:
    * eventId (String): The ID of the event containing the task that is being updated.
    * taskId (String): The ID of the specific task being updated.
  * Query Parameters:
    * userId (String): User ID to be assigned task to.
* Upon Success:
  * HTTP 200 Status Code with task and its respective details.
* Upon Failure:
  * HTTP 404 Status Code is returned along with the message indicating user, event, or task not found.
  * HTTP 500 Internal Server Error for other issues.

##### DELETE /api/events/{eventId}/tasks/{taskId}
* Deletes a specific task associated with an event.
* Expected Input Parameters:
  * Path Parameters:
    * eventId (String): The ID of the event containing the task deleting.
    * taskId (String): The ID of the specific task being deleted.
* Upon Success:
  * HTTP 200 Status Code with successful deletion message.
* Upon Failure:
  * HTTP 404 Status Code is returned along with the message indicating event or task not found.
  * HTTP 500 Internal Server Error for other issues.

#### User Management

##### POST /api/users/add
* Adds a new user to the system.
* Expected Input Parameters:
  * Request Body (JSON):
    * firstName (String): The first name of the user.
    * lastName (String): The last name of the user.
    * email (String): The email address of the user.
    * phone (String, optional): The phone number of the user.
    * role (String, optional): The role of the user (e.g., ADMIN, USER).
* Upon Success:
  * HTTP 200 Status Code with the message "User saved successfully."
* Upon Failure:
  * HTTP 400 Bad Request for invalid input data.
  * HTTP 500 Internal Server Error for other issues.



##### GET /api/users/list
* Retrieves a list of users based on filter criteria.
* Expected Input Parameters:
  * Query Parameters:
    * firstName (String, optional): The first name to filter users.
    * lastName (String, optional): The last name to filter users.
    * email (String, optional): The email address to filter users.
    * phone (String, optional): The phone number to filter users.
    * role (String, optional): The role to filter users (e.g., ADMIN, USER).
* Upon Success:
  * HTTP 200 Status Code with a list of users.
* Upon Failure:
  * HTTP 500 Internal Server Error for other issues.



##### PATCH /api/users/update/{id}
* Updates an existing user's details.
* Expected Input Parameters:
  * Path Parameters:
    * id (Long): The ID of the user to be updated.
  * Request Body (JSON):
    * firstName (String, optional): The new first name of the user.
    * lastName (String, optional): The new last name of the user.
    * email (String, optional): The new email address of the user.
    * phone (String, optional): The new phone number of the user.
    * role (String, optional): The new role of the user (e.g., ADMIN, USER).
* Upon Success:
  * HTTP 200 Status Code with the message "User updated successfully."
* Upon Failure:
  * HTTP 404 Status Code if the user is not found.
  * HTTP 500 Internal Server Error for other issues.



##### DELETE /api/users/delete/{id}
* Deletes a specific user from the system.
* Expected Input Parameters:
  * Path Parameters:
    * id (Long): The ID of the user to be deleted.
* Upon Success:
  * HTTP 200 Status Code with the message "User deleted successfully."
* Upon Failure:
  * HTTP 404 Status Code if the user is not found.
  * HTTP 500 Internal Server Error for other issues.
