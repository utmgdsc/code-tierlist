import {
	Box,
	Button,
	CircularProgress,
	Step,
	StepButton,
	Stepper,
	Typography
} from '@mui/material';
import { useState } from 'preact/hooks';
import { postCodeToAPI } from '../../utils/PostCodeToAPI';

import SubmitCodeRaw from '../submitCode/submitCodeRaw';
import SubmitTestRaw from '../submitTest/submitTestRaw';

import TierList from '../tierlist';

export default function TestNewCode({ id }) {
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState({});
	const [code, setCode] = useState("");
	const [test, setTest] = useState("");

	const steps = [
		{
			name: "Submit working test",
			content: <SubmitTestRaw setCode={setTest} id={id} />,
			buttonText: "Validate test"
		},
		{
			name: "Submit your code",
			content: <SubmitCodeRaw setCode={setCode} id={id} />,
			buttonText: "Submit code"
		},
		{
			name: "View tier list!",
			content: <TierList id={id} />,
			buttonText: "Finish"
		}
	];


	const totalSteps = () => { return steps.length; };

	const completedSteps = () => { return Object.keys(completed).length; };

	const isLastStep = () => { return activeStep === totalSteps() - 1; };

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps();
	};

	const handleNext = () => {
		switch (activeStep) {
			case 0: // Submit working test
				setLoading(true);

				postCodeToAPI({id, code: test})
					.then((res) => {
						console.log(res);
						setCompleted({ ...completed, 0: true });
						setLoading(false);
						setNewActiveStep();
					})
					.catch((err) => {
						console.log(err);
						// HACK: when API is down, continue anyway!
						setNewActiveStep();
						setLoading(false);
					});
				break;
			case 1: // Submit code
				setLoading(true);

				postCodeToAPI({url: "code", id, code})
					.then((res) => {
						console.log(res);
						setCompleted({ ...completed, 1: true });
						setLoading(false);
						setNewActiveStep();
					})
					.catch((err) => {
						console.log(err);
						// HACK: when API is down, continue anyway!
						setNewActiveStep();
						setLoading(false);
					});
				break;
			case 2: // View tier list
				// go home
				try {
					if (typeof window !== "undefined") {
						window.location.href = "/";
					}
				} catch (err) {
					console.log(err);
				}
				break;
		}
	};

	const setNewActiveStep = () => {
		const newActiveStep =
		isLastStep() && !allStepsCompleted()
			? // It's the last step, but not all steps have been completed,
				// find the first step that has been completed
				steps.findIndex((step, i) => !(i in completed))
			: activeStep + 1;
		setActiveStep(newActiveStep);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleStep = (step) => () => {
		setActiveStep(step);
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompleted({});
	};

	return (
		<Box sx={{ maxWidth: '90%', margin: "2em auto" }}>
			<Stepper nonLinear activeStep={activeStep}>
				{steps.map((step, index) => (
					<Step key={step} completed={completed[index]}>
						<StepButton color="inherit" onClick={handleStep(index)}>
							{step.name}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<div>
				{allStepsCompleted() ? (
					<>
						<Typography sx={{ mt: 2, mb: 1 }}>
							All steps completed - you&apos;re finished
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button onClick={handleReset}>Reset</Button>
						</Box>
					</>
				) : (
					<>
						{steps[activeStep].content}
						<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
							<Button
								color="inherit"
								disabled={activeStep === 0 || loading}
								onClick={handleBack}
								sx={{ mr: 1 }}
							>
								Back
							</Button>
							<Box sx={{ flex: '1 1 auto' }} />
							<Button
								onClick={handleNext}
								sx={{ mr: 1 }}
								variant="contained"
								disabled={loading}
								color="success"
							>
								{
									loading && <CircularProgress size={16} sx={{
										marginRight: "0.5em"
									}} />
								}
								{steps[activeStep].buttonText}
							</Button>
						</Box>
					</>
				)}
			</div>
		</Box>
	);
}
