import React, {useState, useEffect} from "react"
import axios from 'axios'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Form = (props) => {

    const [rating, setRating] = useState(7)
    const [popularity, setPopularity] = useState(1200)
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [language, setLanguage] = useState('');
    const [languages, setLanguages] = useState([{english_name:'All',iso_639_1: ''}])
    const [genre, setGenre] = useState('');
    const [genres, setGenres] = useState([{name:'All', id: ''}])
    const dateRange = Array.from({length: 125}, (x, i) => 2025 - i);

    useEffect(() => {
      axios({
        method: 'GET',
        url: props.url + 'configuration/languages?api_key=' + props.api_key
      }).then(res => {

        res.data.sort((a,b) => {
          if(a.english_name > b.english_name){
            return 1
          }else{
            return -1
          }
        })

        for(let i = 0; i < res.data.length; i++){
          if(res.data[i].iso_639_1 === 'en'){
            res.data.unshift(res.data.splice(i,1)[0])
          }
        }
        res.data.unshift({english_name:'All',iso_639_1: ''})
        setLanguages(res.data)
      })
    }, [])

    useEffect(() => {
      axios({
        method: 'GET',
        url: props.url + 'genre/movie/list?api_key=' + props.api_key
      }).then(res => {
        res.data.genres.sort((a,b) => {
          if(a.name > b.name){
            return 1
          }else{
            return -1
          }
        })

        res.data.genres.unshift({name:'All', id: ''})
        setGenres(res.data.genres)
      })
    }, [])

    const handleGeneralChange = (event) => {

      if(event.target.name === 'genre'){
        setGenre(event.target.value)
      }else if(event.target.name === 'language'){
        setLanguage(event.target.value)
      }else if(event.target.name === 'startYear'){
        setStartYear(event.target.value)
      }
      else if(event.target.name === 'endYear'){
        setEndYear(event.target.value)
      }
    };

    const handleRatingChange = (event, newRating) => {
      setRating(newRating);
    }; 

    const handlePopularityChange = (event, newPopularity) => {
      setPopularity(newPopularity);
    }; 

    const handleSubmit = event => {
      event.preventDefault()
      let data = {}
      data.rating = rating
      data.popularity = popularity
      data.language = language
      data.genre = genre
      data.startYear = startYear
      data.endYear = endYear
      props.dataCallback(data)
    }

    return(
          <form onSubmit={handleSubmit} padding={"30px"}>
            <Typography gutterBottom>
              Language
            </Typography>
            <Select
              labelId="languageInfo"
              id="language-info"
              name="language"
              value={language}
              displayEmpty
              onChange={handleGeneralChange}
            >
            {languages.map((language) => {
              return <MenuItem key={language.iso_639_1} value={language.iso_639_1}>{language.english_name}</MenuItem>
            })}
            </Select>
            <br></br><br></br>
            <Typography gutterBottom>
              Genre
            </Typography>
            <Select
              labelId="genreList"
              id="genre-list"
              name="genre"
              value={genre}
              displayEmpty
              onChange={handleGeneralChange}
            >
            {genres.map((genre) => {
              return <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
            })}
            </Select>
            <br></br><br></br>
            <Typography gutterBottom>
            Ratings (0-10):
            </Typography>
            <Slider
              defaultValue={rating}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={10}
              value={rating}
              onChange={handleRatingChange}
            />

            <Typography gutterBottom>
            Popularity (0-20000)
            </Typography>
            <Slider
              defaultValue={popularity}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={100}
              marks
              min={0}
              max={20000}
              value={popularity}
              onChange={handlePopularityChange}
            />

            <Typography gutterBottom>
            From Year
            </Typography>
            <Select
              labelId="startYear"
              id="start-year"
              value={startYear}
              name="startYear"
              displayEmpty
              onChange={handleGeneralChange}
            >
            {dateRange.map((year) => {
              return <MenuItem key={year} value={year}>{year}</MenuItem>
            })}
            </Select>
            <br></br><br></br>
            <Typography gutterBottom>
            To Year
            </Typography>
            <Select
              labelId="endYear"
              id="end-year"
              name="endYear"
              value={endYear}
              displayEmpty
              onChange={handleGeneralChange}
            >
            {dateRange.map((year) => {
              return <MenuItem key={year} value={year}>{year}</MenuItem>
            })}
            </Select>

            <br></br><br></br>
            <Button variant="contained" color="primary" type="submit">Random Movie</Button>
          </form>
    )
}

export default Form