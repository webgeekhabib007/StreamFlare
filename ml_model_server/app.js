const express = require('express');
const { spawnSync } = require('child_process');
const bodyParser = require('body-parser');


const axios = require('axios');




const pythonScriptPath = `${__dirname}/main.py`;
const inputData = ['batman'];  // Adjust based on your input data


const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());


/* {
                    slideItem.data: {
                      DESCRIPTION,
                      IMAGE_URL,
                      MOVIE_ID,
                      RATING,
                      RELEASE_DATE,
                      TIME,
                      TITLE,
                      VIDEO_URL
                    }
                  } */

const getMovieData = async (listOfId) => {
    const movieDataList = await Promise.all(
        listOfId.map(async (id) => {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=36af2cf1e5a1653dc592ba192d078c86`);
                return {
                    DESCRIPTION: response.data.overview,
                    IMAGE_URL: `${response.data.poster_path}`,
                    MOVIE_ID: response.data.id,
                    RATING: response.data.vote_average,
                    RELEASE_DATE: response.data.release_date,
                    TIME: response.data.runtime,
                    TITLE: response.data.title,
                    VIDEO_URL: `${response.data.video_url}`
                };
            } catch (error) {
                console.error(`Error fetching movie data for ID ${id}: ${error.message}`);
                return null;
            }
        })
    );

    return movieDataList.filter(data => data !== null);
};

app.get('/', (req, res) => {
    res.send('Movie Recommendation API is running');
});

app.get('/recommend', (req, res) => {

    // Use spawnSync instead of spawn for synchronous execution
    const pythonProcess = spawnSync('python', [pythonScriptPath, inputData]);

    if (pythonProcess.error) {
        console.error('Error:', pythonProcess.error);
        res.status(500).json({ error: 'internal error' });
        return;
    }

    // Access the output data
    const outputData = pythonProcess.stdout.toString();

    if (pythonProcess.status === 0) {
        console.log('Python script executed successfully');
        var dataToBeSent = JSON.parse(outputData);
        getMovieData(dataToBeSent)
            .then(movieDataList => {
                res.status(200).json(movieDataList);
            })
            .catch(error => {
                console.error(`Error fetching movie data: ${error.message}`);
            });
    } else {
        console.error('Python script execution failed with code:', pythonProcess.status);
        res.status(500).json({ error: 'internal error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
