import os
import shutil
from pathlib import Path


def copy_specific_files(source_dir, dest_dir):
    # List of specific files to copy with their relative paths
    files_to_copy = [
        # ### Admin Section ###
        # # "app/(main)/admin/staff/StaffAdministration.tsx",
        # # "app/(main)/admin/staff/types.ts",
        # "app/(main)/admin/staff/page.tsx",
        # # "app/(main)/admin/AdminSelector.tsx",
        # # "app/(main)/admin/page.tsx",
        # ### Attendance Section ###
        # "app/(main)/attendance/constants.tsx",
        # "app/(main)/attendance/types.ts",
        # "app/(main)/attendance/page.tsx",
        # "app/(main)/attendance/AttendanceRegistry.tsx",
        # "app/(main)/attendance/components/DatePicker.tsx",
        # "app/(main)/attendance/components/AttendanceHeader.tsx",
        # "app/(main)/attendance/components/AttendanceList.tsx",
        # "app/(main)/attendance/components/AddPersonDialog.tsx",
        # "app/(main)/attendance/components/contexts.tsx",
        # "app/(main)/attendance/components/services.ts",
        # ### Maintenance ###
        "app/(main)/maintenance/page.tsx",
        "app/(main)/maintenance/constants.tsx",
        "app/(main)/maintenance/types.ts",
        "app/(main)/maintenance/MaintenanceHome.tsx",
        "app/(main)/maintenance/MaintenanceDrawer.tsx",
        "app/(main)/maintenance/components/component-changeout/ComponentChangeoutList.tsx",
        "app/(main)/maintenance/components/component-changeout/ComponentChangeoutCard.tsx",
        "app/(main)/maintenance/components/component-changeout/ComponentChangeoutForm.tsx",
        "app/(main)/maintenance/components/component-changeout/ComponentChangeoutEdit.tsx",
        "app/(main)/maintenance/components/component-changeout/ComponentSelection.tsx",
        "app/(main)/maintenance/components/component-changeout/contexts.tsx",
        "app/(main)/maintenance/components/component-changeout/services.ts",
        "app/(main)/maintenance/components/equipment/EquipmentDetail.tsx",
        "app/(main)/maintenance/components/equipment/EquipmentList.tsx",
        "app/(main)/maintenance/components/backlog/BacklogList.tsx",
        "app/(main)/maintenance/components/backlog/BacklogCard.tsx",
        "app/(main)/maintenance/components/backlog/BacklogEdit.tsx",
        "app/(main)/maintenance/components/backlog/BacklogForm.tsx",
        "app/(main)/maintenance/components/backlog/contexts.tsx",
        "app/(main)/maintenance/components/backlog/services.ts",
        "app/(main)/maintenance/components/just-do-it/JustDoItList.tsx",
        "app/(main)/maintenance/components/just-do-it/JustDoItCard.tsx",
        "app/(main)/maintenance/components/just-do-it/JustDoItEdit.tsx",
        "app/(main)/maintenance/components/just-do-it/JustDoItForm.tsx",
        "app/(main)/maintenance/components/just-do-it/contexts.tsx",
        "app/(main)/maintenance/components/just-do-it/services.tsx",
        # Core App Files
        # "app/globals.css",
        "app/layout.tsx",
        "app/layout.tsx",
        "app/AppProviders.tsx",
        "app/page.tsx",
        # ### App Components ###
        "app/components/layout/Footer.tsx",
        "app/components/layout/Header.tsx",
        "app/components/layout/SideTab.tsx",
        "app/components/layout/MainLayout.tsx",
        # "app/components/UpdateButton.tsx",
        # "app/components/ProtectedRoute.tsx",
        # "app/components/ServiceWorkerRegister.ts",
        # ### Auth Route ###
        # "app/(auth)/profile/page.tsx",
        # "app/(auth)/signin/page.tsx",
        # "app/(auth)/signin/SignIn.tsx",
        # "app/(auth)/signup/page.tsx",
        # ### Lib Utils ###
        # "lib/context/AuthContext.tsx",
        "lib/config/firebase.ts",
        # "lib/utils.ts",
        "lib/services/initialization.ts",
        "lib/services/admin_equipos.ts",
        "lib/services/admin_personas.ts",
        "lib/services/attendances.ts",
        "lib/services/component_changeouts.ts",
        # "lib/services/index.ts",
        "lib/types/attendance.ts",
        "lib/types/maintenance.ts",
        # "lib/types/index.ts",
        ### Public Assets ###
        "public/manifest.json",
        # "public/sw.js",
        ### Configuration Files ###
        # "firebase.json",
        "next.config.mjs",
        "package.json",
    ]

    # Create destination directory if it doesn't exist
    dest_dir.mkdir(parents=True, exist_ok=True)

    for file_path in files_to_copy:
        # Convert forward slashes to the correct system separator
        file_path = Path(file_path)
        source_file = source_dir / file_path

        # Create a unique name for the flat structure
        file_name = file_path.name
        path_part = str(file_path.parent).replace(os.sep, "_").replace("/", "_")
        unique_name = f"{path_part}_{file_name}" if path_part != "." else file_name

        dest_file = dest_dir / unique_name

        try:
            if source_file.exists():
                # Create parent directories if they don't exist
                dest_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source_file, dest_file)
                print(f"Copied: {source_file} -> {dest_file}")
            else:
                print(f"Warning: Source file not found: {source_file}")
                # Print absolute path for debugging
                print(f"Absolute path attempted: {source_file.absolute()}")
        except Exception as e:
            print(f"Error copying {source_file}: {str(e)}")
            # Print absolute paths for debugging
            print(f"Source absolute path: {source_file.absolute()}")
            print(f"Destination absolute path: {dest_file.absolute()}")


def clean_directory(directory: Path):
    """Clean all contents of the specified directory. Create it if it doesn't exist."""
    if directory.exists():
        print(f"Cleaning directory: {directory}")
        shutil.rmtree(directory)
    directory.mkdir(parents=True, exist_ok=True)
    print(f"Created clean directory: {directory}")


if __name__ == "__main__":
    # Define source and destination directories using Path
    source_directory = Path.cwd()  # Current directory
    destination_directory = source_directory.parent / "flat_specific_files"

    # Clean the destination directory first
    clean_directory(destination_directory)

    print(f"Copying specific files from {source_directory} to {destination_directory}")

    # Execute the copy
    copy_specific_files(source_directory, destination_directory)

    print("\nCopy completed!")
