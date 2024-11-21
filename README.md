# Intro

This project is called the Destiny Stat Tracker. The website retrieves and displays character stats for
varies activities from the video game Destiny 2, developed by Bungie. 

# How It Works

A MongoDB database is seeded beforehand with metric information pulled from Bungie's API. When clicking on the
authorization button on the homepage the user is prompted by Bungie to allow the website access to their Bungie.net
account information. Afterwards, information such as the user's primary console and bungie membership id are retrieved
and used to make subsequent API calls and gather all of their stats info. The stats are then converted into JSON data
and sent to the frontend to be dynamically displayed for viewing experience. If the user does not have a Bungie.net 
account or does not play Destiny 2, a demo page is provided which mimics the functionality of the dashboard page. 

# Got Questions?

This full stack project was completed soley by me, Andre Grandberry, and is hosted using AWS. If you have any inquires
or feeback, please feel free to contact me at my email: dr.dre212@gmail.com
