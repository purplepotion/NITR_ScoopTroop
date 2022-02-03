# Elixir :chart_with_upwards_trend:
## Data Activation Platform and Health Repository 

## 📍Elixir Web App: https://elixir-client-8a3e1.web.app
## 📍HSP Web App: https://hsp-client.web.app

## History & Motivation :bulb:
The recent advancements in Indian healthcare system which motivated us to develop **Elixir** are :   

 - :white_check_mark: After the overwhleming suceess of Unified Payments Interface, India has released a major roadmap under **Atal Digital Bharat Mission** which focuses on establishing a **:globe_with_meridians:Unified Health Interface:globe_with_meridians:** 
 - :white_check_mark: All **:ambulance:healthcare service providers:ambulance:** aren't connected through a single repository which doesn't help in interoperability.
 - :white_check_mark: Lack of features for end user which makes most of the virtual care provider platforms inclusive to only tech-savy individuals.
 - :white_check_mark: There's a **:rotating_light:major lapse in storage and transfer of patient medical records:rotating_light:**, most of the time causing loss of health records and leads to compromised diagnosis 
 - :white_check_mark: Lack of data security and data democratization.
 - :white_check_mark: Vulnerability of paper based records.

    
## About :rocket:
- **Elixir** is a **:wrench:middleware application:wrench:** that enables service providers and end user applications to use the **:globe_with_meridians:Unified Health Interface:globe_with_meridians:.** 
- It acts a central medical repository :card_file_box: for all health records :page_facing_up: and data for a patient and enables quick, systematic and hassle-free **:chart_with_upwards_trend:monitoring of longitudinal medical history:chart_with_upwards_trend:** of patients across the care spectrum by different health facilities i.e doctors, hospitals, etc. 
- It uses a ⚡️**unique consent based approach**⚡️ to let medical data ownership in the hands of patients all the time and employs advanced authentication techniques to ensure secure data transfer while ensuring **:memo:data democratisation:memo:.**
- It also hosts a decentralized dashboard of verified physicians and other healthcare providers powered by **:stethoscope:Digi Doctor:stethoscope:**. 
- The major goal of Elixir is to provide an **:sparkles:umbrella solution to make patient care more accessible:sparkles:** and to remove the heavy lifting of organizing, indexing, and structuring patient information to provide a complete view of the health of individual patients and entire patient populations in a **secure, compliant, and auditable manner.** 

**:pushpin: Please go through the [release information](https://github.com/purplepotion/Elixir/releases/tag/v1.0.0) for more details on features**

## :recycle: Workflow and :art: Design
![Alt Text](https://github.com/purplepotion/Elixir/blob/dev/imgs/elixir%20(5).png)

## Build Instructions :building_construction:
Please insure that you have the following installed in your system.   
**Requirements :memo:**

    Node.js & npm
    Python 3.6 or above
 
 1. :twisted_rightwards_arrows: Fork this repository and clone it to build a local copy of the application in your system.  
 2. Inside the `/client` directory, run `npm install` in your terminal to get all the required dependencies for the client.
 3. Inside the `/hsp_client` directory, run `npm install` again to get all the required dependencies for hsp_client.
 4. In the same directory, build a python virtual environment using venv, by running `python -m venv myvenv` in the terminal. Activate this virtual environment via `source myvenv/bin/activate` in the terminal.
 5. Navigate inside the *server* directory and run `pip install -r requirements.txt` to install all the packages and dependencies inside the virtual environment.
 6. In the same directory, configure and add the environment variables (database URI & secret_key) by making a `.env` file.
 7. In the project directory, modify `app.py` to run in `DEBUG` mode.
 8. Finally start the application :rocket: by opening three terminals, and run the following commands :  
 
        terminal 1: python3 app.py (make sure your virtual environment is activated) 
        terminal 2: npm start (inside /client)
        terminal 3: npm start (inside /hsp_client)


## ScreenShots :camera_flash:
![Alt Text](https://github.com/purplepotion/Elixir/blob/dev/imgs/elixir%20pages.gif)
 
 



