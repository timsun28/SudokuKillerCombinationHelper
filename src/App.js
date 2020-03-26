import React, {Component} from 'react';
import {Container, Grid} from "@material-ui/core";
import {Slider} from "@material-ui/core";
import {Paper, Typography} from "@material-ui/core";
import {Checkbox, FormGroup, FormControlLabel, FormControl} from "@material-ui/core";

export default class App extends Component {
    state = {amountBoxes: 3, sumBoxes: 19, required: [], invalid: [], possibilities: []};

    constructor() {
        super();
        this.state.possibilities = this.getPossibilities();
    }

    getPossibilities = () => {
        const size = this.state.amountBoxes;
        const sudoku_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const allPossibilities = [];

        function setAllCombinations(t, i) {
            if (t.length === size) {
                allPossibilities.push(t);
                return;
            }
            if (i + 1 > sudoku_numbers.length) {
                return;
            }
            setAllCombinations(t.concat(sudoku_numbers[i]), i + 1);
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
            return {possibility: pos, key: index, style: 'primary', label: pos.join(' ')}
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
    getCheckboxes = (type) => {
        const checkboxes = [];
        for (let i = 1; i < 10; i++) {
            checkboxes.push(<FormControlLabel
                value="top"
                control={
                    <Checkbox color="primary"
                              onChange={(e) =>
                                  this.handleChangeCheckboxes(e.target.checked, i, type)
                              }
                    />
                }
                label={i}
                key={i}
                labelPlacement="bottom"
            />)
        }
        return checkboxes;
    };

    getCombinationCards = () => {
        return this.state.possibilities.map(data => {
            return (
                <Grid item xs={4}>
                    <Paper style={{padding: 15, textAlign: 'center'}}
                           key={data.key}>{data.label}</Paper>
                </Grid>
            );
        })
    };

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
                    min={1}
                    max={5}
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
                    max={35}
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
            </Container>
        );
    }
}

