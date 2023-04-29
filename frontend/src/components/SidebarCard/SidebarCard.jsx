import { Box, Card, CardContent } from '@mui/material';
import { GradeColor } from '../../components/GradeColor/GradeColor';
import style from './style.css';

export const SidebarCard = props => {
    return (
        <a href={
            `/project/${props.name.replaceAll(" ", "-").toLowerCase()}`
        } class={style.noUnderline}>
            <Card sx={{
                backgroundColor: "#464646",
                border: "none",
                margin: "1em",
                textDecoration: "none",
                width: "90%",
            }}>
                <CardContent>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Box>
                            <strong class={style.sidebarTitle}>{props.name}</strong> <br />
                            {props.numTest} tests
                            {props.description && <p>{props.description}</p>}
                        </Box>
                        <Box>
                            <GradeColor grade={props.grade} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </a>
    )
}