import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import Header from '../Header';
import SideBar from './SideBar';

const Root = () => {
	return (
		<>
			{/* <Header />
			<Box as="main" pt="20" pb="10" px={{ base: 4, md: 5 }} height="100vh">
				<Suspense fallback={<Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />}>
					<Outlet />
				</Suspense>
			</Box> */}
			<SideBar />
		</>
	);
};

export default Root;
