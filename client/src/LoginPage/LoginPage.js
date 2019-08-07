import Auth from '../Auth/Auth';
import LoginForm from './LoginForm';
import React from 'react';

class LoginPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: '',
			user: {
				email: '',
				password: ''
			}
		}
	}

	processForm(event) {
		event.preventDefault();

		const email = this.state.user.email;
		const password = this.state.user.password;

		console.log('email: ', email);
		console.log('password: ', password);

		// Post login data
		const news_url = 'https://' + window.location.hostname + '/auth/login';
		const request = new Request(news_url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		fetch(request)
			.then(response => {
				if (response.status === 200) {
					this.setState({ error: '' });
					response.json()
						.then(parsed => {
							Auth.authenticateUser(parsed.token, email);
							window.location.replace('/');
						});
				}
				else {
					console.log('login failed!.');
					response.json().then(parsed => {
						const error = parsed.error ? parsed.error : '';
						this.setState({ error });
					});
				}
			});
	}

	changeUser(event) {
		event.preventDefault();

		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;

		this.setState({ user });
	}

	render() {
		return (
			<LoginForm
				onSubmit={(e) => this.processForm(e)}
				onChange={(e) => this.changeUser(e)}
				error={this.state.error}
			/>);
	}
}

export default LoginPage;