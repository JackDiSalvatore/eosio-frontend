import React, { Component } from 'react';

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '35%',
    margin: 'auto auto auto auto',
    // border: '1mm solid rgba(174, 223, 212, .6)'
  },
  permNameStyle: {
    marginRight: '10px'
  },
  voteInfo: {
    // margin: 'auto',
    padding: '0 20px 0 20px'
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
    this.state = {
      showRefunds: false,
      showREX: false,
    };
  }

  // gets table data from the blockchain
  getAccountDetails() {
    //const rpc = new JsonRpc(this.props.endpoint, {fetch});
    console.log('*not implemented*')
  }

  componentDidMount() {
    this.getAccountDetails();
  }

  render() {
    const { showRefunds, showREX } = this.state;
    const { classes, accountInfo, rexBalance, endpoint } = this.props;

    // Liquid Balance
    var eosBalanceLiquid = 0.0000;
    
    if (accountInfo.core_liquid_balance) {
      eosBalanceLiquid = parseFloat(new String(accountInfo.core_liquid_balance).split(' ')[0]);
    }

    // Refunding
    var requestTime = null;
    var refundRequestCPU = '0.0000 EOS';
    var refundRequestNET = '0.0000 EOS';
    var totalRefund = 0;

    if (accountInfo.refund_request) {
      requestTime = accountInfo.refund_request.request_time;
      refundRequestCPU = accountInfo.refund_request.cpu_amount;
      refundRequestNET = accountInfo.refund_request.net_amount;
      totalRefund = parseFloat(new String(refundRequestCPU).split(' ')[0])
                    + parseFloat(new String(refundRequestNET).split(' ')[0]);
    }

    // REX
    var rexVoteStake =  '0.0000 EOS';
    var rex_balance = '0.0000 REX';
    var maturedRex = 0;

    if (rexBalance.owner === accountInfo.account_name) {
      rexVoteStake = rexBalance.vote_stake;
      rex_balance = rexBalance.rex_balance;
      maturedRex = rexBalance.matured_rex;
    }

    // Resources
    var resourcesCPU = '0.0000 EOS';
    var resourcesNET = '0.0000 EOS';
    var totalResources = 0;

    if (accountInfo.total_resources) {
      resourcesCPU = accountInfo.total_resources.cpu_weight;
      resourcesNET = accountInfo.total_resources.net_weight;
      totalResources = parseFloat(new String(resourcesCPU).split(' ')[0]) + parseFloat(new String(resourcesNET).split(' ')[0]);
    }

    // console.log(eosBalanceLiquid)
    // console.log(refundRequestCPU)
    // console.log(refundRequestNET)
    // console.log(resourcesCPU)
    // console.log(resourcesNET)
    // console.log(rexBalanceVoteStake)

    // Total Balance
    var eosTotal = new String(
                              eosBalanceLiquid 
                            + totalRefund 
                            + totalResources 
                            +  parseFloat(new String(rexBalance.vote_stake).split(' ')[0])
                            ) + ' EOS';
 
    // Votes
    var votes = [''];

    if (accountInfo.voter_info) {
      votes = accountInfo.voter_info.producers;
    }
    //console.log(votes);

    let accountNameCard = (
      <Grid container direction="row" spacing={16}>
        <Grid item>
          <Typography component="h2" variant="headline" gutterBottom>
              {accountInfo.account_name}
            </Typography>
        </Grid>
      </Grid>
    )

    let permissionsCard = (
      <Grid container direction="row" spacing={16}>

        <Grid item>
        { this.props.accountInfo.permissions.map((perm, i) => {
            return <Grid container direction="row" spacing={0} className={"perm"} key={i}>
                      
                      <Grid item className={classes.permNameStyle}>
                        <Typography style={{fontSize:12}} variant="body1" gutterBottom>
                          { perm.perm_name } { perm.required_auth.threshold }
                        </Typography>
                      </Grid>

                      <Grid item>
                      { perm.required_auth.keys.map((row, j) => {
                          return <Typography style={{fontSize:12}} variant="body1" className={"row"} key={j}>
                                  { row.weight }: { row.key }
                                </Typography>
                        }) }
                      { perm.required_auth.accounts.map((row, j) => {
                          return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"row"} key={j}>
                                    { row.weight }: { row.permission.actor }@{ row.permission.permission }
                                  </Typography>
                      }) }
                      { perm.required_auth.waits.map((row, j) => {
                          return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"row"} key={j}>
                                  { row.weight }: { row.wait_sec }
                                </Typography>
                      }) }
                      </Grid>

                    </Grid>
          })
        }
        </Grid>

      </Grid>
    )

    let balanceCard = (
      <Grid container direction="row" spacing={16}>

        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            Total EOS:
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            Liquid Balance:
          </Typography>
        </Grid>

        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {eosTotal}
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {eosBalanceLiquid + ' EOS'}
          </Typography>
        </Grid>
      </Grid>
    )
    
    let refundRequestCard = (
      <Grid container direction="row" spacing={16}>
        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            Refunding:
          </Typography>
        </Grid>

        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {totalRefund} EOS [{refundRequestCPU} CPU / {refundRequestNET} NET]
            <span> {requestTime}</span>
          </Typography>
        </Grid>

      </Grid>
    )

    let rexCard = (
      <Grid container direction="row" spacing={16}>
  
        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            REX Vote Stake / REX Balance: 
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            Matured REX: 
          </Typography>
        </Grid>

        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {rexVoteStake} / {rex_balance}
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {maturedRex}
          </Typography>
        </Grid>   

      </Grid>
    )

    let resourceCard = (
      <Grid container direction="row" spacing={16}>
  
        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            RAM Utilization: 
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            CPU:
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            NET:
          </Typography>
        </Grid>

        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            { Math.floor((this.props.accountInfo.ram_usage / this.props.accountInfo.ram_quota)*100) }%
            <span>  [{this.props.accountInfo.ram_usage} / { + this.props.accountInfo.ram_quota} Bytes]</span>
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {Math.floor((this.props.accountInfo.cpu_limit.used / this.props.accountInfo.cpu_limit.max)*100)}%
            <span> [{ (this.props.accountInfo.cpu_limit.available / 1000000) } seconds remaining] </span>
            <span> -> {resourcesCPU} staked</span>
          </Typography>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            {Math.floor((this.props.accountInfo.net_limit.used / this.props.accountInfo.net_limit.max)*100)}% 
            <span> [{this.props.accountInfo.net_limit.available} bytes remaining] </span>
            <span> -> {resourcesNET} staked</span>
          </Typography>
        </Grid>

      </Grid>
    )

    let voteCard = (
      <Grid container direction="row" spacing={16}>
   
        <Grid item>
          <Typography style={{fontSize:12}} variant="body1" gutterBottom>
            Voting For: 
          </Typography>
        </Grid>

        <Grid item>
          <Grid container direction="row" spacing={8}>

            <Grid item className={classes.voteInfo}>
              {votes.map((prod, i) => {
                if (i<6)
                  return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"prod"} key={i}>
                              {prod}
                          </Typography>     
                })
              }         
            </Grid>

            <Grid item className={classes.voteInfo}>
              {votes.map((prod, i) => {
                if (i>=6 && i<12)
                return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"prod"} key={i}>
                            {prod}
                        </Typography>
                })
              }         
            </Grid>

            <Grid item className={classes.voteInfo}>
              {votes.map((prod, i) => {
                if (i>=12 && i<18)
                return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"prod"} key={i}>
                            {prod}
                        </Typography>
                })
              }         
            </Grid>

            <Grid item className={classes.voteInfo}>
              {votes.map((prod, i) => {
                if (i>=18 && i<24)
                return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"prod"} key={i}>
                            {prod}
                        </Typography>
                })
              }         
            </Grid>

            <Grid item className={classes.voteInfo}>
              {votes.map((prod, i) => {
                if (i>=24 && i<30)
                return <Typography style={{fontSize:12}} variant="body1" gutterBottom className={"prod"} key={i}>
                            {prod}
                        </Typography>
                })
              }         
            </Grid>

          </Grid>
        </Grid>

    </Grid>
    )
    // generate each note as a card
    let accountCard = (

      <Grid container direction="row" spacing={8} className={classes.root}>

        <Grid item>
          {accountNameCard}
          {permissionsCard}
          {balanceCard}
          {refundRequestCard}
          {rexCard}
        </Grid>

        <Grid item>
          {resourceCard}
          {voteCard}
        </Grid>

      </Grid>
        
    );

    return (
      <div>

        {accountCard}

        {/* <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update note:
          <br/><br/>
          accounts = { JSON.stringify(this.props.account, null, 2) }
        </pre> */}

      </div>
    );
  }

}

export default withStyles(styles)(AccountDetails);
