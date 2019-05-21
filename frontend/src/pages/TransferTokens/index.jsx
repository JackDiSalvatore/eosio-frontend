import React, { Component } from 'react';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';           // development only

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import Card from '@material-ui/core/Card';
//import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  root: {
    flexGrow: 1,
    //width: '30%',
    marginTop: '2%',
    marginBottom: '2%',
  },
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0,
  },
});


class AccountDetails extends Component {

  constructor(props) {
    super(props)
    // this.state = {
    //   accountDetails: []
    // };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = this.props.account;
    let privateKey = this.props.account.privateKey;
    let to       = event.target.to.value;
    let quantity = event.target.quantity.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "transfer":
        actionName = "transfer";
        actionData = {
          from: account,
          to: to,
          quantity: quantity,
          memo: 'eos is the future'
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc(this.props.endpoint);
    const api = new Api({ rpc, signatureProvider });
    try {
      const result = await api.transact({
        actions: [{
          account: "eosio",
          name: actionName,
          authorization: [{
            actor: account,
            permission: 'active',
          }],
          data: actionData,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });

      console.log(result);
      this.getAccountDetails();
    } catch (e) {
      console.log('Caught exception: ' + e);
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2));
      }
    }
  }

  // gets table data from the blockchain
  // and saves it into the component state: "userResTable"
  getAccountDetails() {
    const rpc = new JsonRpc(this.props.endpoint, {fetch});
    rpc.get_table_rows({
      "json": true,
      "code": "eosio",   // contract who owns the table
      "scope": this.props.account.name,  // scope of the table
      "table": "userres",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result => this.setState({ userResTable: result.rows }));
  }

  componentDidMount() {
    this.getAccountDetails();
  }

  render() {
    // const { userResTable } = this.state;
    const { classes } = this.props;

    let transferActionCard = (
      <Grid container direction="row" justify="center" alignItems="center" className={classes.root} spacing={16}>
          <Grid item>
            <Paper className={classes.paper}>
              <Typography variant="headline" component="h2">
                  Transfer Tokens
              </Typography>
              <form onSubmit={this.handleFormEvent}>
                <TextField
                  name="tokenContract"
                  autoComplete="off"
                  label="Token Contract Name"
                  placeholder="eosio.token"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  name="to"
                  autoComplete="off"
                  label="To"
                  placeholder="eosthefuture"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  name="quantity"
                  autoComplete="off"
                  label="Quantity"
                  placeholder="1.0000 EOS"
                  margin="normal"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.formButton}
                  type="transfer">
                  SEND
                </Button>
              </form>
            </Paper>
          </Grid>
      </Grid>
    )

    return (
      <div>

        {transferActionCard}

      </div>
    );
  }

}

export default withStyles(styles)(AccountDetails);
