// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableRowColumn, TableBody } from 'material-ui/table';
import { Card, CardHeader } from 'material-ui/Card';
import Slider from 'material-ui/Slider';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import TickGroup from 'resonance/TickGroup';
import { updateSortOrder, makeGetSelectedData } from '../module';
import { VIEW, TRBL, AGES } from '../module/constants';
import Bar from './Bar';
import Tick from './Tick';

const barKeyAccessor = (d) => d.name;

export class Example extends Component {

  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTopN = this.setShowTopN.bind(this);
  }

  state = {
    duration: 1500,
    showTopN: this.props.showTop,
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  setShowTopN(e, value) {
    this.setState({
      showTopN: Math.floor(value * 20) + 5,
    });
  }

  render() {
    const { sortKey, data, xScale, yScale, dispatch } = this.props;
    const { duration, showTopN } = this.state;

    return (
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
            <div className="col-md-6 col-sm-6">
              <span>Show Top {showTopN} States:</span>
              <Slider
                style={{ margin: '5px 0px' }}
                defaultValue={0.25}
                onChange={this.setShowTopN}
              />
            </div>
            <div className="col-md-6 col-sm-6">
              <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
              <Slider
                style={{ margin: '5px 0px' }}
                defaultValue={0.1}
                onChange={this.setDuration}
              />
            </div>
          </div>
          <div className="row" style={{ margin: '20px 0px' }}>
            <div className="col-md-12 col-sm-12">
              <h4 style={{ marginTop: -45, marginBottom: -10 }}>Top States by Age Bracket, 2008</h4>
              <p>The bar chart shows the top states for the selected age bracket sorted by population percentage. Adapted from Mike Bostock <a href="https://bost.ocks.org/mike/constancy/">classic example</a> on object constancy.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-3">
              <Table
                wrapperStyle={{ width: '100%' }}
                onCellClick={(d) => dispatch(updateSortOrder(AGES[d]))}
              >
                <TableBody deselectOnClickaway={false}>
                  {AGES.map((age) => {
                    return (
                      <TableRow
                        key={age}
                        selected={sortKey === age}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableRowColumn>{age}</TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="col-md-9 col-sm-9" style={{ padding: 0 }}>
              <Surface view={VIEW} trbl={TRBL}>
                <NodeGroup
                  data={data}
                  xScale={xScale}
                  yScale={yScale}
                  duration={duration}
                  nodeComponent={Bar}
                  keyAccessor={barKeyAccessor}
                />
                <TickGroup
                  scale={xScale}
                  duration={duration}
                  tickCount={8}
                  tickComponent={Tick}
                />
              </Surface>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Example.propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  showTop: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    return getSelectedData(state);
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(Example);
