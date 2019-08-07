// import './NewsCard.css';

import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import Auth from '../Auth/Auth';

import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share';

class NewsCard extends React.Component {
    redirectToUrl(url, event) {
        event.preventDefault();
        this.sendClickLog();
        window.open(url, '_blank');
    }
    
    sendClickLog() {
    const url = 'https://' + window.location.hostname + '/news/userId=' + Auth.getEmail() +
      '&newsId=' + this.props.news.digest;

    const request = new Request(
          encodeURI(url), {
            method: "POST",
            headers: { 'Authorization': 'bearer ' + Auth.getToken() },
          });
    
        fetch(request);
    }

    render() {
        return (
            <Card className="card">
       <CardActionArea>
         <CardMedia
           component="img"
           height="320"
           image={this.props.news.urlToImage}
         />
         <CardContent>
           <Typography gutterBottom variant="h4" component="h2">
             {this.props.news.title}
           </Typography>
           {this.props.news.source != null && <Chip label={this.props.news.source} color="primary" />}
           &nbsp; &nbsp;
           {this.props.news.reason != null && <Chip label={this.props.news.reason} color="secondary" />}
           &nbsp; &nbsp;
           {this.props.news.time != null && <Chip label={this.props.news.time} variant="outlined" color="primary" />}
           <br/>
           <br/>
           <Typography component="p">
             {this.props.news.description}
           </Typography>
         </CardContent>
       </CardActionArea>
       <CardActions>
         <Button size="small" color="primary" onClick={(event)=>this.redirectToUrl(this.props.news.url, event)}>
           Learn More
         </Button>
    		<FacebookShareButton url={this.props.news.url}> 
    		<FacebookIcon size={32} round />
    		</FacebookShareButton>
       </CardActions>
       <CardActions>
       &nbsp; &nbsp; To share:
       &nbsp; 
    		<FacebookShareButton url={this.props.news.url}> 
    		<FacebookIcon size={32} round />
    		</FacebookShareButton>
       &nbsp;
            <TwitterShareButton url={this.props.news.url}> 
    		<TwitterIcon size={32} round />
    		</TwitterShareButton>
       &nbsp; 
            <LinkedinShareButton url={this.props.news.url}> 
    		<LinkedinIcon size={32} round />
    		</LinkedinShareButton>
       
       </CardActions>
     </Card>
        );
    }
}

export default NewsCard;