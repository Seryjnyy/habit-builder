import React, {useEffect, useState} from 'react';
import {Autocomplete, Chip, createFilterOptions, TextField} from "@mui/material";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";
import {useAuth} from "../Auth/UserAuthContext";

const filter = createFilterOptions();

function LabelSelect({value, setValue, availableTags}){
    const {user} = useAuth();
    // const [options2, setOptions2] = useState([]);

    // if a new tag then it needs to be saved to user tags in db
    // check for this when we create the task
    // load in user tags
    // useEffect(() => {
    //     const q = query(collection(db, "tags"), where("userID", "==", user.uid));
    //     getDocs(q).then((result) => {
    //         setOptions2(result.docs.map(doc => {
    //             const data = doc.data();
    //
    //             return {
    //                 value: data.tag,
    //                 name: data.tag,
    //                 createdNow: false
    //             }
    //         }))
    //     });
    // }, []);



    return (
        <Autocomplete
            multiple
            selectOnFocus
            filterSelectedOptions
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            options={availableTags}
            value={value}
            isOptionEqualToValue={(option1, option2) => option1.name === option2.name}
            getOptionLabel={option => {
                if (option.inputValue) {
                    return option.inputValue;
                }

                return option.name;
            }}
            renderTags={(value, getTagProps) => (
                value.map((option, index) => (
                    <Chip {...getTagProps({index})} label={option.value} />
                ))
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={"Tags"}
                />
            )}
            onChange={(event, value) => {
                setValue(value);
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.title);

                if (inputValue !== '' && !isExisting) {

                    filtered.push({
                        value: inputValue,
                        name: `Add "${inputValue}"`,
                        createdNow: true
                    });

                }

                return filtered;
            }}
        />
    );
}

export default LabelSelect;