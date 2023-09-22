import React, {useEffect, useState} from 'react';
import {
    Center,
    Card,
    CardBody,
    Heading,
    Stack,
    Divider,
    Text,
    Image,
    IconButton,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Modal,
    useDisclosure,
    Input,
    Select,
    FormControl, FormLabel, CheckboxGroup, Checkbox, useToast, CardFooter
} from '@chakra-ui/react'

import '/assets/css/style.css'
import {Link} from "react-router-dom";
import {SmallAddIcon} from "@chakra-ui/icons";
import {Form} from "../components/Form";

export const EventsPage = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const [data, setData] = useState(null);
    const [categories, setCategories] = useState(null);
    const [users, setUsers] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [categoryValue, setCategoryValue] = useState(0);

    const toast = useToast()

    // Form
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        startDate: '',
        endDate: '',
        categories: [],
        user: 0,
    });

    const handleChange = (e) => {
        console.log(e.target.value)
        console.log(e.target.name)
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (selectedCategories) => {
        setFormData({
            ...formData,
            categories: selectedCategories,
        });
    };

    const submitForm = (e) => {
        e.preventDefault();
        // Here you can access formData and submit it or perform any other actions
        console.log(formData, formData.categories.map((category) => parseInt(category)),);

        // Create an object containing the form data to send in the request
        const formDataToSend = {
            title: formData.title,
            description: formData.description,
            image: formData.imageUrl,
            location: formData.location,
            startTime: formData.startDate,
            endTime: formData.endDate,
            createdBy: formData.user,
            categoryIds: formData.categories.map((category) => parseInt(category)),
        };

        if (formData.title == '' || formData.description == '' || formData.imageUrl == '' || formData.location == '' || formData.startDate == '' || formData.endDate == '' || formData.categories.length == 0 || formData.user == 0) {
            onOpen()
            return   toast({
                title: 'Vul alle velden in.',
                // description: ".",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }

        // Make the POST request
        fetch('http://localhost:3000/events/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the response data here (e.g., show a success message)
                console.log('Data received:', data);
                toast({
                    title: 'Event toegevoegd.',
                    // description: ".",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                window.location.reload();
            })
            .catch((error) => {
                // Handle errors here (e.g., display an error message)
                console.error('There was a problem with the fetch operation:', error);
                toast({
                    title: 'Er is iets fout gegaan.',
                    description: "probeer het later opnieuw",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            });

    };


    useEffect(() => {
        fetch('http://localhost:3000/events')
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error(error));

        fetch('http://localhost:3000/categories')
            .then(response => response.json())
            .then(json => setCategories(json))
            .catch(error => console.error(error));

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(json => setUsers(json))
            .catch(error => console.error(error));
    }, []);

    const setSearchInput = (event) => {
        setSearchValue(event.target.value.toLowerCase())
    }

    const setCategoryInput = (event) => {
        setCategoryValue(event.target.value.toLowerCase())
    }

    if (data && categories && users) {

        return <>

            <Heading className={'title'}>List of events</Heading>
            <Center>
                <Input onChange={setSearchInput} width={"md"} placeholder='Search'/>
            </Center>
            <Center padding={'10px'}>
                <Select onChange={setCategoryInput} width={"md"} placeholder='Select option'>
                    {categories.map((category) => (
                        <option value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>
            </Center>

            <div className={"eventContainer"}>
                {data
                    ? data.map((item) => {
                        // Define a flag to check if the item matches the selected category
                        let matchesCategory = false;

                        // Check if any of the category IDs in item.categoryIds matches the selected category ID
                        if (
                            item.title.toLowerCase().includes(searchValue) ||
                            item.description.toLowerCase().includes(searchValue) ||
                            item.location.toLowerCase().includes(searchValue)
                        ) {
                            if (categories) {
                                item.categoryIds.forEach((categoryid) => {
                                    const matchingCategory = categories.find(
                                        (category) => category.id === categoryid
                                    );
                                    if (matchingCategory) {
                                        if (matchingCategory.id == categoryValue || categoryValue == 0) {
                                            matchesCategory = true;
                                        }
                                    }
                                });
                            }
                        }

                        // Render the item only if it matches the selected category
                        if (matchesCategory) {
                            return (
                                <Link to={`/event/${item.id}`} key={item.id}>
                                    <div className={"eventDiv"}>
                                        <Card maxW='sm'>
                                            <CardBody align='center'>
                                                <Image
                                                    src={`${item.image}`}
                                                    alt='Green double couch with wooden legs'
                                                    borderRadius='lg'
                                                />
                                                <Stack mt='6' spacing='3'>
                                                    <Heading size='md'>
                                                        {item.title}
                                                    </Heading>
                                                    <Text>
                                                        {item.description}
                                                    </Text>
                                                    <Divider/>
                                                    <Text className={"cato"}>
                                                        {categories ?
                                                            // console.log(categories)
                                                            item.categoryIds.map(categoryid => {
                                                                return categories.map(category => {
                                                                    // console.log(category)
                                                                    if (category.id === categoryid) {
                                                                        return category.name + " "
                                                                    }
                                                                })
                                                            })
                                                            : <p>Loading...</p>
                                                        }
                                                    </Text>
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </Link>
                            );
                        }
                        return null; // Return null for items that don't match the category
                    })
                    : <p>Loading...</p>}

            </div>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit={submitForm}>
                            {/* Input fields */}
                            <Text mb='8px'>Title:</Text>
                            <Input
                                type='text'
                                name='title'
                                placeholder='Title'
                                value={formData.title}  // Bind the value to the state
                                onChange={handleChange} // Handle changes
                            />
                            <Text mb='8px'>Desciption:</Text>
                            <Input
                                size='sm'
                                type='text'
                                name='description'
                                placeholder='Desciption'
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Text mb='8px'>Image URL:</Text>
                            <Input
                                type={'text'}
                                name='imageUrl'
                                placeholder='ImageURL'
                                size='sm'
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                            <Text mb='8px'>Location:</Text>
                            <Input
                                type={'text'}
                                name='location'
                                placeholder='Location'
                                size='sm'
                                value={formData.location}
                                onChange={handleChange}
                            />
                            <FormLabel as='legend'>
                                Category:
                            </FormLabel>
                            {/* Category checkboxes */}
                            <CheckboxGroup
                                colorScheme='green'
                                value={formData.categories}
                                onChange={handleCategoryChange}
                            >
                                {/* Category checkboxes */}
                                {/* Sports */}
                                <Checkbox value='1'>Sports</Checkbox>
                                {/* Games */}
                                <Checkbox value='2'>Games</Checkbox>
                                {/* Relaxation */}
                                <Checkbox value='3'>Relaxation</Checkbox>
                            </CheckboxGroup>


                            {/* Start date */}
                            <Input
                                type='datetime-local'
                                name='startDate'
                                placeholder='Select Date and Time'
                                value={formData.startDate} // Bind the value to the state
                                onChange={handleChange} // Handle changes
                            />

                            {/* End date */}
                            <Input
                                type='datetime-local'
                                name='endDate'
                                placeholder='Select Date and Time'
                                value={formData.endDate} // Bind the value to the state
                                onChange={handleChange} // Handle changes
                            />

                            <Select
                                name={'user'}
                                value={formData.user} // Bind the selected user to formData.user
                                onChange={handleChange} // Handle changes
                                width={"md"}
                                placeholder='Select option'
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Select>

                            {/* Submit button */}
                            <Button onClick={onClose} type='submit'>Submit</Button>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <IconButton
                onClick={onOpen}
                className={"addButton"}
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Done'
                fontSize='20px'
                icon={<SmallAddIcon/>}
            />

        </>;
    }
    return <>
        <Heading className={'title'}>List of events</Heading>
        <div className={"eventContainer"}>
            <p>Loading...</p>
        </div>
    </>
};
