import React, {useEffect, useState} from "react"
import Spinner from './Spinner/Spinner'
import axios from 'axios'
import Form from './Form/Form'
import MovieDisplay from './MovieDisplay/MovieDisplay'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box'
import Alert from '@material-ui/lab/Alert';
import tmdb from '../images/tmdb.svg'

const App = () => {
  const API_KEY = 'e14c0b9ace34c59179849cf6b600f43f'
  const URL = 'https://api.themoviedb.org/3/'

  const [loading, setLoading] = useState(true)
  const [movieString, setMovieString] = useState('&sort_by=vote_average.desc?certification_country=US&vote_average.gte=8&vote_count.gte=300')
  const [loadMovieState, setLoadMovieState] = useState(0)
  const [movieData, setMovieData] = useState('')
  const [genres, setGenres] = useState('')
  const [genreString, setGenreString] = useState('')
  const [checked, setChecked] = useState(false);

  const logoStyles = {
    position: "fixed",
    bottom: "2%",
    left: "1%",
    width: "5%"
  };

  const alertStyle = {
    position: "fixed",
    width: "58%",
    alignItems: "center",
    left: "20%",
    bottom: "2%"
  };

  function getRandom(max) {
    return Math.ceil(Math.random() * max);
  }

  //get movie data
  useEffect(() => {
    setLoading(true)
      axios({
        method: 'GET',
        url: URL + 'discover/movie?api_key=' + API_KEY + movieString
      }).then(res => {
        setChecked(false)

        axios({
          method: 'GET',
          url: URL + 'discover/movie?api_key=' + API_KEY + movieString + '&page=' + getRandom(res.data.total_pages) 
        }).then(res => {
          let randomNum = getRandom(res.data.results.length-1)
          setMovieData(res.data.results[randomNum])

          if(!genres){
            axios({
              method: 'GET',
              url: URL + 'genre/movie/list?api_key=' + API_KEY
            }).then(res2 => {
              res2.data.genres.sort((a,b) => {
                if(a.name > b.name){
                  return 1
                }else{
                  return -1
                }
              })
      
              res2.data.genres.unshift({name:'All', id: ''})
              parseGenres(res2.data.genres, res.data.results[randomNum].genre_ids)
              setGenres(res2.data.genres)
            })
          }else{
            parseGenres(genres, movieData.genre_ids)
          }
        }).catch(
          function (error) {
            setChecked(true)
            return Promise.reject(error)
          }
        )
      })
    setLoading(false)
  }, [loadMovieState])

  //parse genres
  const parseGenres = (genre_list, genre_ids) => {
    let tempGenres = ''

      for(let i = 0; i < genre_ids.length; i++){
        for(let j = 0; j < genre_list.length; j++){
          if(genre_list[j].id === genre_ids[i]){
            tempGenres += genre_list[j].name + ", "
            break
          }
        }
      }
      
      if(tempGenres){
        tempGenres = tempGenres.slice(0, -2)
      }

      setGenreString(tempGenres)
  }

  //callback for form
  const handleDataCallback = (data) => {
    let url = ''

    if(data.language){
      url = url + '&with_original_language=' + data.language
    }
    
    if(data.rating){
      url = url + '&vote_average.gte=' + data.rating
    }

    if(data.popularity){
      url = url + '&vote_count.gte=' + data.popularity
    }

    if(data.genre){
      url = url + '&with_genres=' + data.genre
    }

    if(data.startYear){
      url = url + '&primary_release_date.gte=' + data.startYear + '-01-01'
    }

    if(data.endYear){
      let endYear = parseInt(data.endYear) + 1 
      url = url + '&primary_release_date.lte=' + endYear + '-01-01'
    }

    setMovieString(url)

    if(loadMovieState == 0){
      setLoadMovieState(1)
    }else{
      setLoadMovieState(0)
    }
  }

  return (
    <Box height="100%" padding={1} borderRadius={1} borderColor="primary.main">
        <Grid container alignItems="stretch" margin="auto">
          <Grid item style={{background:"white"}} xs={12}>
            <Box px={4} margin={"1%"} textAlign="center">
              <br></br>
            </Box>
          </Grid>
          <Grid item style={{background:'linear-gradient(white 80%,  #3c54b5 70%)'}} xs={3}>
            <Box padding={4} margin={"auto"} height={"70%"} minHeight={"600px"}>
              <Form api_key={API_KEY} url={URL} dataCallback={handleDataCallback} />
            </Box>
          </Grid>
          <Grid item style={{background:'linear-gradient(white 80%,  #3c54b5 70%)'}} xs={9} height={"100vh"}>
            <MovieDisplay info={movieData} genres={genreString}/>
          </Grid>
        </Grid>
        {loading && <Spinner />}
        <Hidden mdDown>
          <img style={logoStyles} src={tmdb} alt="logo" />
        </Hidden>
        <Fade in={checked}>
          <Alert style={alertStyle} severity="info">Unable to find a movie. Please optimize your filter.</Alert>
        </Fade>
      </Box>
  );
}

export default App;
