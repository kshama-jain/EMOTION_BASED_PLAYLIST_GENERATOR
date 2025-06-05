# Playlist Generation 


### Project Structure and how to run it.


#### ./creating

- To create the chroma db with the songs information, please follow the ```playlist.ipynb``` file.
- To create the sentiment analysis model, please follow ```sentiment.ipynb```
- Make sure to update the csv file names accordingly
- Also ensure the system has Ollama installed and model 'mistral' and 'llama 3.2' have been pulled.

#### ./frontend
- The frontend folder
- To install dependencies:
  ```
    npm i
  ```
- To run it:
  ```
    npm run dev
  ```

#### ./backend
- The backend folder
- Please follow the sql schema, and update the config file accordingly.
- To install dependencies
  ```
    pip install -r requirements.txt
  ```
- To run it:
  ```
    uvicorn app.main:app --reload
  ```



### Project Flow

- User gives Input in from of text (like a diary entry)
- Emotion Identified using Bert Emotion Detection Model
- Diary is summarised and converted to embeddings
- ChromaDB is indexed with these embeddings and top k songs are indexed.
- Emotional Journey is created based on the diary entry using Ollama and from the k songs, furthers songs are filtered based on the emotion matches with the list of emotions as provided by the emotional journey.
- Further filtering is done based on current weather and time of query.
- Playlist is created from the list of songs in the database.
- An emphathetic response is generated along with the playlist and given to the user.


### Languages Considered: 
- English
- Hindi
- Marathi
- Telegu
- Urdu
- Kannada
- Tamil
- Gujarati


### Emotions Considered:
- Very Sad
- Moderately Sad
- Little Sad
- Okayish
- Giddy
- Pleasant
- Party!!
- Yikes 
- Angry
- Spooky


### The RAG Pipeline 

##### This project is based on the RAG Architecture.
- RAG stands for Retrieval-Augmented Generation.
- A standard RAG Pipeline has two phases
    - Data Indexing
    - Retrieval & Generation
- For this project, Data Indexing includes :
    - Data Loading
        - The songs were loaded into the csv file.
    - Data Embedding
        - The songs metadata and summary is converted into vector form using an embedding model thus making it understandable for computers.
    - Data Storing
        - These vector embeddings are saved in chromadb - a vector database, allowing fast retrieval.

- In the Retrieval and Generation step:
    - Retrieval:
        - User inputs a diary entry which is first transformed into a vector (query vector) using the same embedding model from the Data Indexing phase.
        - This query vector is then matched against all vectors in chromadb (The diary summary is matched to the song summary) to find the most similar songs.
        - There are additional constraints related to weather, time and emotion of the song as well.
    - Generation:
        - An Ollama model called 'llama3.2' (LLM Model) takes the user’s question and the relevant information retrieved from chromadb to create a response.
        - This process combines the question with the identified data to generate an answer.
        - The output is refined to provide an emphathetic response to the user, and additional emotional jounrey planning is also done to provide list of songs with varying emotions.





  ![image](https://github.com/user-attachments/assets/9c5116a6-91a2-495c-b103-967b678f6afd)
  
  ![image](https://github.com/user-attachments/assets/723214ab-d98d-45a3-bcaf-9eaf6fc2cd67)
