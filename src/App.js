import { AppBar, Button, Container, createMuiTheme, Grid, Paper, ThemeProvider, Toolbar, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Component, useState, useEffect } from 'react';
import Canvas from './Canvas';


class App extends Component {

  constructor(props) {
    super(props)
    this.canvas = null
    this.handleSubmit = () => {
      this.setState({
        loading:true
      })
      const user_drawing = this.canvas.save();
      console.log(user_drawing);
      fetch('http://127.0.0.1:5000/getImage/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(user_drawing),
        responseType: 'blob'
      })
      .then(res => res.blob())
      .then(res => {
        console.log(res);
        this.setState({
          loading:false,
          imageUrl: URL.createObjectURL(res)
        });
      });
        

    }
    this.handleClear = () => {
      this.canvas.clear();
      this.setState({imageUrl: "https://avatarfiles.alphacoders.com/116/116710.png"});
    }
    this.state = {
      resultHidden: false,
      loading:false,
      imageUrl: "https://avatarfiles.alphacoders.com/116/116710.png"
    }

  }

  render() {

    document.title = 'Sketch2Anime'
    return (
      <Container>
        <AppBar position='absolute'>
          <Toolbar>
            <Typography variant='h5'>
              Sketch2Anime
          </Typography>
          </Toolbar>
        </AppBar>
        {/* <Grid container spacing={3} style={{ margin: 96 }} > */}
        <Grid container spacing={3} style={{ marginTop: 96 }}>
          <Grid item xs={6}>
            {/* <Paper style={{ padding: 36 }}  > */}
            <Canvas ref={e => this.canvas = e} />
            <div style={{ textAlign: 'center' }}>
              <Button variant='contained' color='primary' style={{ marginRight: 24 }} onClick={this.handleSubmit}>SUBMIT</Button>
              <Button variant='outlined' color='secondary' onClick={this.handleClear}>CLEAR</Button>
            </div>
            {/* </Paper> */}
          </Grid>
          <Grid item xs={6}>
            {/* <Paper style={{ padding: 0 }} hidden={this.state.resultHidden}  > */}
            {
              this.state.loading ?
                <Skeleton animation="wave" variant="rect" width={512} height={512} /> :
                <img src={this.state.imageUrl} style={{ height: 512, width: 512 }} hidden={this.state.resultHidden} />
            }

            {/* </Paper> */}
          </Grid>

        </Grid>
        {/* </Grid> */}
      </Container>
    )
  }
}

export default App;
