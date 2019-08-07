import './SignUpForm.css';

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const SignUpForm = ({
	onSubmit,
	onChange,
	error,
}) => (
	<div className="signup-panel">
		 <Paper className="paper">
			 <Typography component="h1" variant="h4">
				 Sign up
			 </Typography>
			 <form onSubmit={onSubmit}>
			   {error && <p className="error-message">{error}</p>}
				 <FormControl margin="normal" required fullWidth>
					 <InputLabel htmlFor="email">Email Address</InputLabel>
					 <Input id="email" name="email" autoComplete="email" autoFocus onChange={onChange} />
				 </FormControl>
				 <FormControl margin="normal" required fullWidth>
					 <InputLabel htmlFor="password">Password</InputLabel>
					 <Input name="password" type="password" id="password" autoComplete="current-password" onChange={onChange} />
				 </FormControl>
				 <FormControl margin="normal" required fullWidth>
					 <InputLabel htmlFor="password">Confirm Password</InputLabel>
					 <Input name="confirm_password" type="password" id="confirm_password" autoComplete="current-password" onChange={onChange} />
				 </FormControl>
				 <br/>
				 <br/>
				 <Button
					 type="submit"
					 fullWidth
					 variant="contained"
					 color="primary">
					 Sign in
				 </Button>
			 </form>
		 </Paper>
	 </div>
);

SignUpForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	error: PropTypes.func.isRequired
}

export default SignUpForm;

