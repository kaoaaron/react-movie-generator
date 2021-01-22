import React, {useEffect, useState} from "react"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box'
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import '../../index.css'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: "white",
    background: "#3f50b5",
    marginBottom: "10px"
  },
  text: {
    color: "#3f50b5"
  }
}));


const MovieDisplay = (props) => {

  const classes = useStyles();
  const title = "Original Title: "

  useEffect(() => {
    if(props.info){
      let tempGenre = ''

      for(let i = 0; i < props.info.genre_ids.length; i++){
        for(let j = 0; j < props.genres.length; j++){
          if(props.genres[j].id === props.info.genre_ids[i]){
            tempGenre += props.genres[j].name + ", "
            break
          }
        }
      }
      
      if(tempGenre){
        tempGenre = tempGenre.slice(0, -2)
      }
    }
    
  }, [])

  return (
    <Box width="90%" bgcolor="white" padding={1} marginRight={"30px"} border={4} borderRadius={16} borderColor="primary.main">
      <Grid container >
        <Grid item xs={12}>
            <Paper className={classes.paper}>
              {props.info.title}
            </Paper>
        </Grid>

        <Grid item xs={5}>
          <img src={'https://image.tmdb.org/t/p/w500/' + props.info.poster_path}  alt="img" width="80%"/>
        </Grid>

        <Grid item xs={7} padding={"30px"}>
          <h3 style={{color: "#3f50b5", marginBottom: '0'}}>Overview</h3><hr />
          <p style={{fontSize:"1.2em"}}>{props.info.overview}</p>
          <Hidden mdDown>
            <img src={'https://image.tmdb.org/t/p/w400/' + props.info.backdrop_path}  alt="img" width="80%"/><br></br>
          </Hidden>
          <b className={classes.text}>Genre(s):</b> {props.genres}<br></br>
          <b className={classes.text}>Released:</b> {props.info.release_date}<br></br>
          <b className={classes.text}>Popularity:</b> {props.info.popularity}<br></br>
          <b className={classes.text}>Rating:</b> {props.info.vote_average}/10<br></br>
          {props.info.title !== props.info.original_title && <b className={classes.text}>{title}</b>}
          {props.info.title !== props.info.original_title && props.info.original_title}<br></br>
        </Grid>
      </Grid>
      </Box>
  );
}

export default MovieDisplay;
