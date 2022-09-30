export const getAvailableTagsFromTasks = (tasks) => {
    const tags = new Set();

    if(tasks == undefined)
        return null;

    // console.log(tasks);
    tasks.forEach(task => {
        task.data.tags?.forEach(tag => tags.add(tag));
    });

    return Array.from(tags);
}