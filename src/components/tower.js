import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { moveDiscFrom, resetForNextMove, activateGame } from '../actions/game_actions';
import { createArrayOfLength } from '../util/general_util';
import Disc from './disc';

const towerTarget = {
  drop: (props, monitor, component) => {
    props.setEndTower(props.idx);
    console.log('C')
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  hovered: monitor.isOver(),
  item: monitor.getItem(),
})

const msp = (state) => ( state.game );

const mdp = (dispatch) => ({
  moveDiscFrom: (tower) => dispatch(moveDiscFrom(tower)),
  resetForNextMove: () => dispatch(resetForNextMove()),
  activateGame: () => dispatch(activateGame()),
});

class Tower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      discs: createArrayOfLength(this.props.noOfDiscs),
    }
    this.colors = {
      0: '#E02936', // red
      1: '#D6752D', // orange
      2: '#BAB341', // yellow
      3: '#189A79', // green
      4: '#107392', // blue
      5: '#493362', // purple
      6: '#6A5279', // light purple
      7: '#5C6D98', // greyish blue
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({loaded: true}), this.props.delay);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.startTower && typeof nextProps.startTower === 'number' && (nextProps.startTower === nextProps.idx || nextProps.endTower === nextProps.idx)) {
      this.setState({
        discs: nextProps.status[nextProps.idx]
      });
      this.props.resetForNextMove();
    } else if (this.props.noOfDiscs !== nextProps.noOfDiscs || this.props.totalDiscsNum !== nextProps.totalDiscsNum) {
      this.setState({ discs: nextProps.status[nextProps.idx], });
    }
  }

  generateDiscs() {
    const { idx, delay, moving } = this.props;
    return (
      this.state.discs.map((i) => {
        const style = {
          background: this.colors[i],
          transform: `scaleX(${2.0 + 1 * i})`,
        }
        return <Disc key={i} 
                     i={this.state.discs.indexOf(i)}
                     tower={idx} 
                     towerHeight={this.state.discs.length}
                     styling={style} 
                     delay={delay + 250 * (this.state.discs.length - (i + 1))}
                    //  isOldDisc={this.state.oldDiscs && this.state.oldDiscs.includes(i) && this.state.newDiscs.includes(i)}
                     moveDiscFrom={(tower) => this.props.moveDiscFrom(tower)}
                     activateGame={() => this.props.activateGame()}
                    />
      })
    )
  }

  render() {
    const { connectDropTarget, hovered, item } = this.props;
    const style = hovered ? { background: '#a1a1a1', borderBottomColor: '#a1a1a1' } : {};
    return connectDropTarget(
      <ul id={`tower-${this._reactInternalFiber.key}`} className={this.state.loaded ? 'tower' : 'tower hidden'} style={style}>
        {this.generateDiscs()}
      </ul>
    )
  }
}

export default DropTarget('disc-and-tower', towerTarget, collect)(connect(msp, mdp)(Tower));