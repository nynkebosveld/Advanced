import React, {useEffect, useState} from 'react';
import {
  Card,
  Center,
  CardBody,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
  CardFooter,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  FormLabel,
  CheckboxGroup,
  Checkbox,
  Select,
  ModalFooter,
  Modal, useDisclosure, useToast
} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import {Navigation} from "../components/Navigation.jsx";
import { Avatar, Button } from '@chakra-ui/react'
import { GoCircleSlash, GoPencil } from "react-icons/go";
import {Icon} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'


export const EventPage = () => {
  const {isOpen: isModal, onOpen: openModal, onClose: closeModal} = useDisclosure()
  const {isOpen: isAlert, onOpen: openAlert, onClose: closeAlert} = useDisclosure()
  const {eventId} = useParams();
  const [item, setItem] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const cancelRef = React.useRef()

  const toast = useToast()

  const [formData, setFormData] = useState({
    id: '',
    createdBy: '',
    title: '',
    description: '',
    imageUrl: '',
    location: '',
    startTime: '',
    endTime: '',
    categories: [],
  });

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/events/' + eventId).then((response) =>
          response.json()
      ),
      fetch('http://localhost:3000/categories').then((response) => response.json()),
    ])
        .then(([itemData, categoriesData]) => {
          setItem(itemData);
          setCategories(categoriesData);
            setFormData({

                title: itemData.title,
                description: itemData.description,
                createdBy: itemData.createdBy,
                imageUrl: itemData.image,
                location: itemData.location,
                startDate: itemData.startTime,
                endDate: itemData.endTime,
                categories: itemData.categories,
            });
          // Now fetch user data using item.userId
          return fetch('http://localhost:3000/users');
        })
        .then((response) => response.json())
        .then((userData) => setUser(userData))
        .catch((error) => console.error(error));



  }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
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
      console.log(formData);

      const updatedData = {
        title: formData.title,
        description: formData.description,
        image: formData.imageUrl,
        location: formData.location,
        startTime: formData.startDate,
        endTime: formData.endDate,
        categoryIds: formData.categories.map((category) => parseInt(category)),
      }

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

        fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Handle the response data here (e.g., show a success message)
            console.log('Data updated:', data);
            location.reload();
            toast({
              title: 'Event geupdate.',
              // description: ".",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })
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

    const confirmDelete = () => {

      fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
      })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // Handle a successful delete here (e.g., show a success message)
            console.log('Item deleted successfully');
            navigate('/')
            toast({
              title: 'Gelukt!.',
              description: "Event verwijderd.",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })

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
    }


    if (item && categories && user) {
    console.log(item, user);
    return <>
      <Navigation/>
      <Center>
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
              <Text>
                {item.startTime} - {item.endTime}
              </Text>
              <Divider/>
              <Text>
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
                <Divider/>
                <Text>
                    {
                            user.map(user => {
                              if (user.id === item.createdBy) {
                                return <Center key={user.id}>
                                  <Avatar name={user.name} src={user.image} />
                                  <Text className={"userName"}>{user.name}</Text>
                                </Center>
                              }
                            })
                    }
                </Text>
            </Stack>
          </CardBody>
          <CardFooter>
            <Divider/>
            <Center>
              <Button onClick={openAlert}>
                <Icon as={GoCircleSlash}></Icon>
              </Button>
              <Button onClick={openModal}>
                <Icon as={GoPencil}></Icon>
              </Button>
            </Center>
          </CardFooter>
        </Card>
      </div>
      </Center>

      <Modal isOpen={isModal} onClose={closeModal}>
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

              <Select value={formData.user} onChange={handleChange} width={"md"} placeholder='Select option'>
                {user.map((user) => (
                    <option value={user.id}>
                      {user.name}
                    </option>
                ))}
              </Select>

              {/* Submit button */}
              <Button onClick={closeModal} type='submit'>Save</Button>
            </form>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
          isOpen={isAlert}
          leastDestructiveRef={cancelRef}
          onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete event
            </AlertDialogHeader>

            <AlertDialogBody>
              Deze actie kan niet ongedaan gemaakt worden.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </>;
    } else {
    return <Center>
      <p>Loading...</p>;

        </Center>
  }
};
