import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Typography from "@mui/material/Typography";
import {Navigate} from "react-router-dom/dist";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import styles from "./Login.module.scss";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";
export const Login = () => {
	const isAuth = useSelector(selectIsAuth);
	const [formError, setFormError] = React.useState(false);
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: {errors, isValid},
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});
	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));
		if (!data.payload) {
			return setFormError(true);
		}
		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
		}
	};
	if (isAuth) {
		return <Navigate to="/" />;
	}
	return (
		<Paper elevation={0} classes={{root: styles.root}}>
			<Typography classes={{root: styles.title}} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					{...register("email", {required: "Укажите почту"})}
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Пароль"
					{...register("password", {required: "Укажите пароль"})}
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					fullWidth
					type="password"
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth>
					Войти
				</Button>
				{formError && (
					<p className="css-1wc848c-MuiFormHelperText-root Mui-error ss-1wc848c-MuiFormHelperText-root">
						Неверное имя пользователя или пароль
					</p>
				)}
			</form>
		</Paper>
	);
};
