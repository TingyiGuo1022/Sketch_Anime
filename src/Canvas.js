import { Button, ButtonGroup, Grid, styled, Typography, withStyles } from '@material-ui/core';
import { blue, brown, green, grey, orange, pink, purple, red, yellow } from '@material-ui/core/colors';
import Color from 'color';
import React from 'react'
import CanvasDraw from 'react-canvas-draw';
class Canvas extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            brushRadius: 2,
            brushColor: '#000000'
        }
        this.canvas = null
        this.setCanvasRef = element => {
            this.canvas = element
        }
        this.save = () => {

            return this.canvas.getSaveData();
        }
        this.clear = () => {
            this.canvas.clear()
        }

        this.changeColor = (color, sketch) => {
            this.setState({ brushRadius: sketch ? 2 : 10, brushColor: sketch ? color : Color(color).fade(0.4) })
        }

    }

    MyButton = styled(({ color, hoverColor, sketch, ...other }) => <Button {...other} onClick={() => this.changeColor(color[500], sketch)} />)({
        color: props => props.hoverColor ? props.color : props.color[500],
        backgroundColor: props => props.hoverColor ? props.color : props.color[500],
        '&:hover': {
            backgroundColor: props => props.hoverColor ? props.hoverColor : props.color[700],
        },
        height: 36
    })

    render() {
        return (
            <div>
                <CanvasDraw ref={this.setCanvasRef} canvasWidth={512} canvasHeight={512} brushRadius={this.state.brushRadius} brushColor={this.state.brushColor} lazyRadius={0} />

                <Grid container spacing={3} style={{ margin: 24 }}>
                    <Grid xs={2}>

                        <Typography variant='h6'>Sketch</Typography>
                        <this.MyButton color='#000000' hoverColor='#000000' sketch />

                    </Grid>
                    <Grid xs={8}>
                        <Typography variant='h6'>Color</Typography>
                        <ButtonGroup>
                            <this.MyButton color={pink} />
                            <this.MyButton color={red} />
                            <this.MyButton color={orange} />
                            <this.MyButton color={yellow} />
                            <this.MyButton color={green} />
                            <this.MyButton color={blue} />
                            <this.MyButton color={purple} />
                            <this.MyButton color={brown} />
                            <this.MyButton color={grey} />
                            <this.MyButton color='#000000' hoverColor='#000000' />


                        </ButtonGroup>


                    </Grid>
                </Grid>



            </div>
        );
    }
}

export default Canvas;