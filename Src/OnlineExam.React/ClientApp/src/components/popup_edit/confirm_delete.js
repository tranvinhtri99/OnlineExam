export const confirmDelete = (onYes) => {
    if (window.confirm("Are you sure you want to delete?")){
        onYes();
    }
}