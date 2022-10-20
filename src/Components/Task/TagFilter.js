import { Chip } from "@mui/material";
import React, { useEffect } from "react";

export default function TagFilter({ availableTags, setAvailableTags }) {
  useEffect(() => {
    console.log("look rerendering after trying the button.");
  }, []);

  if (availableTags == null) return;

  return (
    // will cause problems if there are duplicate tags
    availableTags.map((tag, index) => (
      <Chip
        key={tag + index}
        label={tag.name}
        onClick={() => {
          const availableTagsTemp = [...availableTags];
          availableTagsTemp[index] = {
            name: availableTagsTemp[index].name,
            selected: !availableTagsTemp[index].selected,
          };
          setAvailableTags([...availableTagsTemp]);
          console.log("im trying");
        }}
        sx={{ backgroundColor: tag.selected ? "red" : "blue" }}
      />
    ))
  );
}
