import React, { useState } from 'react';
import {Checkbox, CheckboxGroup, FormLabel, Input, Text} from '@chakra-ui/react';
export const Form = () => {
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            imageUrl: '',
            location: '',
            startDate: '',
            endDate: '',
            categories: [],
        });

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
        };

        return (
            <form onSubmit={submitForm}>
                {/* Input fields */}
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Text mb='8px'>Title:</Text>
                <Input
                    placeholder='Here is a sample placeholder'
                    size='sm'
                    value={formData.title}
                    onChange={handleChange}
                />
                <Text mb='8px'>Desciption:</Text>
                <Input
                    placeholder='Here is a sample placeholder'
                    size='sm'
                    value={formData.description}
                    onChange={handleChange}
                />
                <Text mb='8px'>Image URL:</Text>
                <Input
                    placeholder='Here is a sample placeholder'
                    size='sm'
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
                <Text mb='8px'>Location:</Text>
                <Input
                    placeholder='Here is a sample placeholder'
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
                    <Checkbox value={1}>Sports</Checkbox>
                    <Checkbox value={2}>Games</Checkbox>
                    <Checkbox value={3}>Relaxation</Checkbox>
                </CheckboxGroup>

                <Text mb='8px'>Start date:</Text>
                <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange}
                />
                <Text mb='8px'>End date:</Text>
                <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
                />
                {/* Submit button */}
                <button type='submit'>Submit</button>
            </form>
        );
}