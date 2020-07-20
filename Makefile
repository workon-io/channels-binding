deploy:
	python autotag.py minor
	make pypi_upload
	make push

deploy_medium:
	python autotag.py medium
	make pypi_upload
	make push

deploy_major:
	python autotag.py major
	make pypi_upload
	make push

push:
	git push

pypi_upload:
	python setup.py sdist upload -r pypi || echo 'channels-bind is up-to-date'

develop:
	sudo pip install .
	python setup.py develop --user

undevelop:
	sudo pip uninstall channels-bind 
	
clean:
	find . -type f -name "*.pyc" -delete
	rm -rf nosetests.xml coverage.xml htmlcov *.egg-info *.pdf dist violations.txt

