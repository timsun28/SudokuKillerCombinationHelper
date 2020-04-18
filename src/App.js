import React, {Component} from 'react';
import {Container, Grid} from "@material-ui/core";
import {Slider} from "@material-ui/core";
import {Paper, Typography} from "@material-ui/core";
import {Checkbox, FormGroup, FormControlLabel, FormControl} from "@material-ui/core";
import {LinearProgress} from "@material-ui/core";

export default class App extends Component {
    state = {amountBoxes: 3, sumBoxes: 19, required: [], invalid: [], possibilities: [], sudokuNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9]};

    constructor() {
        super();
        this.state.possibilities = this.getPossibilities();
    }

    getPossibilities = () => {
        const size = this.state.amountBoxes;
        const sudokuNumbers = this.state.sudokuNumbers;
        const allPossibilities = [];

        function setAllCombinations(t, i) {
            if (t.length === size) {
                allPossibilities.push(t);
                return;
            }
            if (i + 1 > sudokuNumbers.length) {
                return;
            }
            setAllCombinations(t.concat(sudokuNumbers[i]), i + 1);
            setAllCombinations(t, i + 1);
        }

        setAllCombinations([], 0);

        let correctPossibilities = [];
        allPossibilities.forEach((res) => {
            if (res.reduce((a, b) => a + b, 0) === this.state.sumBoxes) {
                correctPossibilities.push(res)
            }
        });

        this.state.required.forEach((req) => {
            correctPossibilities = correctPossibilities.filter((el) => el.includes(req));
        });

        this.state.invalid.forEach((req) => {
            correctPossibilities = correctPossibilities.filter((el) => !el.includes(req));
        });
        correctPossibilities = correctPossibilities.map((pos, index) => {
            return {possibility: pos, key: index, style: 'primary', label: pos.join(' '), color: "#3f51b5"}
        });
        return correctPossibilities;
    };
    handleChangeSlider = (value, id) => {
        this.setState({[id]: value});
        this.setState({possibilities: this.getPossibilities()});
    };
    handleChangeCheckboxes = (isChecked, number, type) => {
        const currentArray = this.state[type];
        if (isChecked) {
            currentArray.push(number);
        } else {
            const index = currentArray.indexOf(number);
            if (index !== -1) currentArray.splice(index, 1);
        }
        this.setState({[type]: currentArray});
        this.setState({possibilities: this.getPossibilities()});
    };

    toggleBackgroundColorPaper = (paperId) => {
        const currentPossibilities = this.state.possibilities;
        const clickedPossibilityIndex = currentPossibilities.findIndex(pos => {return pos.key === paperId});
        currentPossibilities[clickedPossibilityIndex].hidden = !currentPossibilities[clickedPossibilityIndex].hidden;
        this.setState({possibilities: currentPossibilities})
    };

    getCheckboxes = (type) => {
        return this.state.sudokuNumbers.map((number) => {
            return <FormControlLabel
                value="top"
                control={
                    <Checkbox color="primary"
                              onChange={(e) =>
                                  this.handleChangeCheckboxes(e.target.checked, number, type)
                              }
                    />
                }
                label={number}
                key={number}
                labelPlacement="bottom"
            />
        });
    };

    getCombinationCards = () => {
        return this.state.possibilities.map(data => {
            const color = data.hidden ? '#AA3939' : '#3f51b5'
            return (
                <Grid item xs={4}>
                    <Paper style={{color:"white", backgroundColor: color, padding: 15, textAlign: 'center'}}
                           key={data.key}
                           onClick={() => {this.toggleBackgroundColorPaper(data.key)}}
                    >
                        <b>{data.label}</b>
                    </Paper>
                </Grid>
            );
        })
    };

    getFrequencies = () => {
        const frequencies = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0}
        const possibilities = this.state.possibilities.filter((pos) =>  !pos.hidden);
        const total = possibilities.length;

        possibilities.forEach((pos) => {
            pos.possibility.forEach((number) => {
                frequencies[number] += 1;
            })
        })

        return Object.keys(frequencies).map(freq => {
            const percentage = frequencies[freq] === 0 ? 0 : frequencies[freq] / total
            return(
                <Grid item xs={4}>
                    {freq}: {Math.round(percentage * 100)} % <LinearProgress key={freq} variant="determinate" value={percentage * 100} />
                </Grid>
            )
        })
    }

    render() {
        return (
            <Container fixed={false} maxWidth={'md'}>
                <h1>
                    Sudoku Killer Helper
                </h1>
                <Typography gutterBottom>
                    Amount of squares:
                </Typography>
                <Slider
                    defaultValue={3}
                    step={1}
                    min={2}
                    max={9}
                    marks
                    valueLabelDisplay={'on'}
                    aria-labelledby={"discrete-slider-always"}
                    onChangeCommitted={(e, value) => this.handleChangeSlider(value, 'amountBoxes')}
                />
                <Typography gutterBottom>
                    Sum of boxes:
                </Typography>
                <Slider
                    defaultValue={19}
                    step={1}
                    min={3}
                    max={45}
                    marks
                    valueLabelDisplay={'on'}
                    aria-labelledby={"discrete-slider-always"}
                    onChangeCommitted={(e, value) => this.handleChangeSlider(value, 'sumBoxes')}
                />
                <FormControl component="fieldset">
                    <Typography gutterBottom>
                        Required Values:
                    </Typography>
                    <FormGroup aria-label="position" row>
                        {this.getCheckboxes('required')}
                    </FormGroup>
                </FormControl>
                <FormControl component="fieldset">
                    <Typography gutterBottom>
                        Invalid Values:
                    </Typography>
                    <FormGroup aria-label="position" row>
                        {this.getCheckboxes('invalid')}
                    </FormGroup>
                </FormControl>
                <div style={{flexGrow: 1, paddingTop: 20}}>
                    <Grid container spacing={3}>
                        {this.getCombinationCards()}
                    </Grid>
                </div>
                <div style={{flexGrow: 1, paddingTop: 20}}>
                    <Grid container spacing={3}>
                        {this.getFrequencies()}
                    </Grid>
                </div>
            </Container>
        );
    }
}

