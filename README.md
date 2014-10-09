Mappetizer
===========

Overview

This application was built to exercise newly aquired skills in ruby, ruby on rails, and javascript. Four members of the second cohort of Web Development Immersive Students at the General Assembly Washington, D.C. worked on this project: Pam Assogba, Wade Buckland, Martin Johnson, and Lisa Snider. It was completed as part of a 4 day sprint modeling agile software development processes.

The the purpose of the application is to help people coordinate group outings by listing potential events to attend depending on a chosen city and date range. 

Sample user stories completed were:
- As a guest, I can visit a homepage that links to sign-in and sign-up pages.
- As a user, I can sign-in to my account.
- As a guest, I can sign-up for an account.
- As a user, I can view, edit, and delete outings that I've created in the past.
- As a user, I can create a new outing by selecting a location and a date range.
- As a user, I can add events to my outing by selecting markers on a map.
- As a user, I can share my outing with others via email.

For list of user stories and backlog, see the public https://www.pivotaltracker.com/s/projects/1181394.

Technology used:
- Ruby on Rails 4.1.5.
- PostgreSQL Database
- The Devise gem for log-in.
- Testing using RSPEC

Find an the application here:
http://salty-cove-1064.herokuapp.com/

## Local Setup

    rake db:create
    rake db:migrate
    rake db:seed
    rails s