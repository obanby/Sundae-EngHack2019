# EngHack19

 [Demo](https://sundae-d9273.appspot.com/api/v1)
 
## Inspiration
Mental health has been a huge issue that something we as a society generally have not given enough attention to for quite a while now. This has only gotten worse by the intrusion of social media into our lives and the introduction of everything digital in our lives.

Something that really helps with mental health is journalling. However, while we all know it is good for us, the activation energy required to actually sit down and journal using pen and paper is a big reason why most of us can't sustain this habit. Therefore, we wanted to create the experience of journalling more seamless and peaceful while also adding some friendly features along the way to enrichen the experience.

## What it does
The user starts off by registering with their phone number on the web portal. After doing so and setting their preferences for how often they want to be prompted, their account is created. After this, based on their response, the next day, using Twilio, we prompt the user on their desired team with check-in via SMS over how their day is going? We then conduct a sentiment-analysis on their response. Based on the results of the response, if it's positive, we ask more questions to learn why it was positive and how to get to that desired states. If it is negative, we engage in a meaningful way to encourage participation and also recommend them a few events using a recommendation engine nearby that could help them relax!

On the web portal, we make a way for the user to access all their records like they would with a normal journal. In addition to that, we also provide them with some statistics about their journal over a certain period of time!

## How we built it

![alt text](https://github.com/Elbanby/EngHack2019/blob/master/system_architecture.png)


## Challenges we ran into
In hindsight, there were a lot of challenges that we ran into as a team. For the ML aspect, the first challenge was NLP. Initially, we hoped to classify texts into multiple categories such as anxious, calm, depressed et cetera using Naive Bayes. However, contrary to our hypothesis, we were not able to find a suitably large dataset with labelling/trained model and creating a dataset from scratch would take too long.

Another challenge we ran into was using python for Firebase access. It turns out that Python has no way to create listeners for objects stored in Firebase database. Because we couldn't find this issue earlier, we had to rewrite/simplify all our Recommendation code in NodeJS.

Moreover we ran into few challanges with nodeJS asynch model as well. Since we were trying to load test the system on local machines. We ran into some un-expected behaviour, that took some serious debugging. 

## Accomplishments that we're proud of
We are very proud of all the work that we have been able to accomplish. At the end of the day, we were happy about firstly being able to do NLP on the text. Additionally, while there is still work to be done on the chatbot side, we are proud of the recommendations that our system is able to make to the user.

## What we learned
We learned a lot about various parts of our tech stack while working on this. To start off, we learned a great deal about Twilio and fully explored its capabilities. We also learned a ton about NLP and Recommendation Engines.

We learned a lot about nodeJS design patterns, error handling and event based programming principles. We were really passionate about architecture and how we model our data and API, which lead to more learning along the way.

## What's next for Sundae
Recommendation Engine: Making the recommendation of the event smarter

NLP: Making more categories for the moods

Chatbot: Make the conversational agent more human

Architecture: Improve our platform and system architecture

Front-End : Make it more welcoming and user friendly

privacy issues: keep the user info/messages confidential, 

Potential features for the UI and geolocation

