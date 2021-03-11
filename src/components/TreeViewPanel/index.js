import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { fade, withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { Typography, Box } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import useStyles from './style';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DescriptionIcon from '@material-ui/icons/Description';
import { CustomInput } from '@app/components/Custom';

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
    }
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool
};

function StyledTreeItem(props) {
  const classes = useStyles();
  const {
    labelText,
    labelIcon: LabelIcon,
    color,
    bgColor,
    state,
    ...other
  } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          {state === 'published' && (
            <Box className={classes.state} component={Typography}>
              Published
            </Box>
          )}
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label
      }}
      TransitionComponent={TransitionComponent}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelText: PropTypes.string.isRequired
};

// const StyledTreeItem = withStyles((theme) => ({
//   iconContainer: {
//     '& .close': {
//       opacity: 0.3,
//     },
//   },
//   group: {
//     marginLeft: 7,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
//   },
// }))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);
let clicks = [];
let timeout;
const CustomTreeView = ({
  resources,
  setSelectedTreeItem,
  onClick,
  onChange,
  setSelected,
  selected,
  setExpanded,
  expanded
}) => {
  const classes = useStyles();

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    event.preventDefault();
    clicks.push(new Date().getTime());
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      if (
        clicks.length > 1 &&
        clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250
      ) {
        if (clicks.length > 10) {
          clicks = [];
        }
        onChange('rename');
      } else {
        console.log('single');
      }
    }, 250);

    setSelected(nodeIds);
    if (nodeIds == 'root') {
      setSelectedTreeItem([{ _id: 'root' }]);
    } else {
      let selectedItem = resources?.filter((e) => e._id === nodeIds);
      setSelectedTreeItem(selectedItem);
      onClick('single', selectedItem[0]);
    }
  };

  // const handleTreeItemClick = (selectedIndex) => {
  //   setSelectedTreeItem(selectedIndex);
  // };

  const childrenTreeItems = (resources, parentID, nodeIndex) => {
    let data = resources.filter((e) => e.parent === parentID);
    return (
      data &&
      data?.map((el, index) => (
        <StyledTreeItem
          key={el._id}
          nodeId={el._id}
          labelText={el.name}
          labelIcon={el.subType == 'document' ? DescriptionIcon : FolderIcon}
          state={el.state}
          // onClick={() => onClick('single', el)}
        >
          {childrenTreeItems(resources, el._id, index + 2)}
        </StyledTreeItem>
      ))
    );
  };

  return (
    <TreeView
      className={classes.mainRoot}
      // defaultExpanded={['root']}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      <StyledTreeItem
        key="null"
        nodeId="root"
        labelText="root"
        labelIcon={FolderIcon}
      >
        {childrenTreeItems(resources, 'root', 1)}
      </StyledTreeItem>
    </TreeView>
  );
};

export default CustomTreeView;
