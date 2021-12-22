# Pick-up API

[live link](https://pick-up-api.herokuapp.com)
(live link)[https://pick-up-api.herokuapp.com]

### Routes
| Type | Route | Name | Description | Protected/Private |
| --- | :---: |  :---: | :---: | :---: |
| POST | /auth/register | Register| register new user and send token | No |
| POST | /auth/ | Auth User| Decode token and get current user | Yes |
| GET | /auth/login | Login| Login user and send token | No |

| GET | /events/ | Get All Events| Logged in user can see all events | Yes |
| POST | /events/ | Create Event| User can create a new event | Yes |
| GET | /events/:id | Get One Event | Get one event by id | No |
| PUT | /events/:id | Update Event| Logged in user can edit their events | Yes |
| DELETE | /events/:id | Delete Event | Users can delete their own events | Yes |

| PUT | /events/:id/like | Like Event| Users can like any event | Yes |
| PUT | /events/:id/comment | Like Event| Users can like any event | Yes |
| PUT | /events/:id/join | Like Event| Users can like any event | Yes |

Todo:
- add param to error msg so you can add conditional styling to form labels
