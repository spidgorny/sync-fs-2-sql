"use client";
import { Alert } from "react-daisyui";

export function ErrorAlert(props: { error: any }) {
	if (!props.error) {
		return null;
	}
	return <Alert status="error">{props.error}</Alert>;
}
