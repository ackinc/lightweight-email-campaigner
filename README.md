# Khonvo Hiring Challenge

[Problem statement](https://docs.google.com/document/d/1y4EiJWGMrg7ArXrEyvXppjl4JfCUfB3dHi8exHxYJB0/edit)

##### Notes/Rationale
- Why RDBMS/SQL, and normalized data models?
  - Normalizing the data (separating campaigns and leads into different models, instead of storing leads as an array of email addresses inside each campaign) saves space for the most likely use-case of leads being sent multiple campaigns' emails
  - SQL is just easier to do analytics queries with
    - Queries like "What % of emails sent to lead XYZ were opened?" would be hard without SQL and normalization

- Why separate repos for front-end and back-end?
  - Keeping the back-end separate and independent from any front-end allows it to function as a data-only-server, which makes supporting multiple front-ends (web, mobile, etc.) easier
  - Front-ends become static sites that can be put on CDNs for better end-user performance

- Good-to-have things that are probably not going to go into the submission:
  - Features
    - scheduling future campaigns
    - matching email delivery time with lead's timezone
    - admin role (currently, all users see only the campaigns they created)
    - allowing body of campaign email to be specified as markdown
    - allow user to choose from styled email templates when creating campaign
    - attachments in campaign emails
  - Edge-case handling
    - if the call to save a new user (with refresh token) to DB fails, we'll never get a refresh token
      - this will not be a problem until future scheduling of campaigns is implemented
    - oauth refresh token invalidation
    - jwt extension (when used near expiry date)
  - Security
    - HTTPS
    - Only enable CORS for authorized frontends
    - XSS protection (if admin role being implemented)
