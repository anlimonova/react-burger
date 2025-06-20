import React from 'react';
import styles from './number-info.module.css';
import * as PropTypes from 'prop-types';

export const NumberInfo = ({ title, number }) => {
	return (
		<div className={styles['number-info']}>
			<span className={'text_type_main-default'}>{title}</span>
			<span className={'text_type_digits-default mt-2'}>{number}</span>
		</div>
	);
};

NumberInfo.propTypes = {
	title: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
};
