import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { useBind, usePassiveBind } from "@channels-binding/core";


export default () => {

    const id = 1

    const retrieve = useBind(`back1:app.User.retrieve#${id}`)
    usePassiveBind({ event: `back1:app.User.updated#${id}`, intercept: retrieve.dispatch })
    const randomizeAge = useBind(`back1:app.User.randomize_age#${id}`)

    const { first_name, last_name, age, email } = retrieve.data

    return (
        <Paper style={{ height: 400 }}>
            <h2>An User details auto updated from django signals</h2>
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Pk: {id}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {first_name} {last_name}
                    </Typography>
                    <Typography color="textSecondary">
                        Age: {age}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Email: {email}
                    </Typography>
                </CardContent>
            </Card>
            <CardActions>
                <Button variant="outlined" onClick={randomizeAge.dispatch}>Randomize {first_name}'s age</Button>
            </CardActions>
        </Paper>
    );
}